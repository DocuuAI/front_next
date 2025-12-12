"use client";

import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Deadline } from "@/lib/mockData";
import { differenceInDays } from "date-fns";

interface DeadlineCardProps {
  deadline: Deadline;
}

export default function DeadlineCard({ deadline }: DeadlineCardProps) {
  const daysUntil = differenceInDays(new Date(deadline.dueDate), new Date());
  
  const urgencyColor = 
    daysUntil <= 3 ? "text-red-500 bg-red-500/10" :
    daysUntil <= 7 ? "text-yellow-500 bg-yellow-500/10" :
    "text-green-500 bg-green-500/10";

  const priorityColor =
    deadline.priority === "high" ? "bg-red-500/10 text-red-500" :
    deadline.priority === "medium" ? "bg-yellow-500/10 text-yellow-500" :
    "bg-green-500/10 text-green-500";

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-200 bg-card border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${urgencyColor}`}>
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              {deadline.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {deadline.description}
            </p>
          </div>
        </div>
        <Badge className={priorityColor}>
          {deadline.priority}
        </Badge>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{new Date(deadline.dueDate).toLocaleDateString()}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${urgencyColor}`}>
          <AlertCircle className="w-4 h-4" />
          <span>{daysUntil} days left</span>
        </div>
      </div>
    </Card>
  );
}