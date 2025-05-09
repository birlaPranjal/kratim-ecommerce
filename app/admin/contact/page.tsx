"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MoreVertical, Trash, Eye, Mail } from "lucide-react"
import { ContactSubmission } from "@/lib/contact"

export default function AdminContactPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  useEffect(() => {
    fetchSubmissions()
  }, [])
  
  const fetchSubmissions = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/admin/contact")
      
      if (!response.ok) {
        throw new Error("Failed to fetch contact submissions")
      }
      
      const data = await response.json()
      setSubmissions(data.submissions)
    } catch (err) {
      console.error("Error fetching contact submissions:", err)
      setError("Failed to load contact submissions. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  const handleView = async (submission: ContactSubmission) => {
    setSelectedSubmission(submission)
    setIsViewDialogOpen(true)
    
    // Mark as read if it's new
    if (submission.status === "new") {
      try {
        const response = await fetch(`/api/admin/contact/${submission._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "read" }),
        })
        
        if (response.ok) {
          // Update local state
          setSubmissions(prevSubmissions => 
            prevSubmissions.map(sub => 
              sub._id === submission._id 
                ? { ...sub, status: "read" } 
                : sub
            )
          )
        }
      } catch (err) {
        console.error("Error updating submission status:", err)
      }
    }
  }
  
  const handleDelete = (id: string) => {
    setSubmissionToDelete(id)
    setIsDeleteDialogOpen(true)
  }
  
  const confirmDelete = async () => {
    if (!submissionToDelete) return
    
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/contact/${submissionToDelete}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete submission")
      }
      
      toast({
        title: "Submission deleted",
        description: "The contact submission has been deleted.",
      })
      
      // Update local state
      setSubmissions(prevSubmissions => 
        prevSubmissions.filter(sub => sub._id !== submissionToDelete)
      )
      
    } catch (err) {
      console.error("Error deleting submission:", err)
      toast({
        title: "Error",
        description: "Failed to delete submission. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setSubmissionToDelete(null)
    }
  }
  
  const handleReplyByEmail = (email: string) => {
    window.open(`mailto:${email}`, "_blank")
  }
  
  const markAsReplied = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "replied" }),
      })
      
      if (response.ok) {
        // Update local state
        setSubmissions(prevSubmissions => 
          prevSubmissions.map(sub => 
            sub._id === id 
              ? { ...sub, status: "replied" } 
              : sub
          )
        )
        
        toast({
          title: "Status updated",
          description: "The submission has been marked as replied.",
        })
      }
    } catch (err) {
      console.error("Error updating submission status:", err)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const getStatusBadge = (status: ContactSubmission["status"]) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
      case "read":
        return <Badge variant="outline">Read</Badge>
      case "replied":
        return <Badge className="bg-green-500 hover:bg-green-600">Replied</Badge>
      default:
        return null
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchSubmissions}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Refresh"
          )}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Contact Submissions</CardTitle>
          <CardDescription>
            View and manage all customer inquiries and feedback from the contact form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchSubmissions} 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-10 text-center border rounded-md bg-muted/10">
              <p className="text-muted-foreground">No contact submissions yet.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission._id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{submission.subject}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(submission)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReplyByEmail(submission.email)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Reply by Email
                            </DropdownMenuItem>
                            {submission.status !== "replied" && (
                              <DropdownMenuItem onClick={() => markAsReplied(submission._id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Mark as Replied
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => handleDelete(submission._id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* View Submission Dialog */}
      {selectedSubmission && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Contact Submission Details</DialogTitle>
              <DialogDescription>
                Submitted {formatDistanceToNow(new Date(selectedSubmission.createdAt), { addSuffix: true })}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div>{getStatusBadge(selectedSubmission.status)}</div>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                  <p>{selectedSubmission.name}</p>
                </div>
                
                <div className="space-y-1 col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                  <p className="break-all">{selectedSubmission.email}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Subject</h4>
                <p>{selectedSubmission.subject}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Message</h4>
                <div className="rounded-md border p-4 whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="destructive" 
                onClick={() => {
                  setIsViewDialogOpen(false)
                  handleDelete(selectedSubmission._id)
                }}
              >
                Delete
              </Button>
              
              <div className="space-x-2">
                {selectedSubmission.status !== "replied" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      markAsReplied(selectedSubmission._id)
                      setSelectedSubmission(prev => 
                        prev ? { ...prev, status: "replied" } : null
                      )
                    }}
                  >
                    Mark as Replied
                  </Button>
                )}
                
                <Button 
                  onClick={() => handleReplyByEmail(selectedSubmission.email)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Reply by Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contact submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 