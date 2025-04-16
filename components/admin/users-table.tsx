"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"
import { MoreHorizontal, UserCog } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  _id: string
  name: string
  email: string
  image?: string
  role: "user" | "admin"
  createdAt: string | Date
}

interface UsersTableProps {
  users: any[]
}

export default function UsersTable({ users }: UsersTableProps) {
  const { toast } = useToast()
  const router = useRouter()

  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newRole, setNewRole] = useState<string>("")

  const handleOpenDialog = (user: any) => {
    setSelectedUser(user)
    setNewRole(user.role)
  }

  const handleCloseDialog = () => {
    setSelectedUser(null)
    setNewRole("")
  }

  const handleUpdateRole = async () => {
    if (!selectedUser || newRole === selectedUser.role) {
      handleCloseDialog()
      return
    }

    try {
      setIsUpdating(true)

      const response = await fetch(`/api/users/${selectedUser._id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      })

      if (!response.ok) {
        throw new Error('Failed to update user role')
      }

      toast({
        title: "Role updated",
        description: `User role has been updated to ${newRole}.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "There was an error updating the user role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
      handleCloseDialog()
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={user.role === "admin" ? "default" : "outline"}
                      className={user.role === "admin" ? "bg-amber-600" : ""}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(user)}>
                          <UserCog className="mr-2 h-4 w-4" /> Change Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.name}. This will change their permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRole}
              className="bg-amber-600 hover:bg-amber-700"
              disabled={isUpdating || newRole === selectedUser?.role}
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
