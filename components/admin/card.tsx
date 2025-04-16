import { cn } from "@/lib/utils"
import { 
  Card as ShadcnCard, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { ReactNode } from "react"

interface CardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  footer?: ReactNode
  className?: string
}

export function Card({ 
  title, 
  value, 
  description, 
  icon, 
  footer, 
  className 
}: CardProps) {
  return (
    <ShadcnCard className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="w-4 h-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </ShadcnCard>
  )
} 