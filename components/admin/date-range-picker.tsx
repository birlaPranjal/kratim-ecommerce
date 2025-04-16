"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<string>('This month')

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className="w-[200px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="end">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setDate('Today')}
            >
              Today
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setDate('This week')}
            >
              This week
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setDate('This month')}
            >
              This month
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setDate('Last 3 months')}
            >
              Last 3 months
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}