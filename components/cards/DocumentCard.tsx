"use client";

import { FileText, MoreVertical, Download, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Document } from "@/lib/mockData";
import { useRouter } from "next/navigation";

interface DocumentCardProps {
  document: Document;
  onDelete?: (id: string) => void;
}

const typeColors: Record<string, string> = {
  GST: "bg-blue-500/10 text-blue-500",
  PAN: "bg-green-500/10 text-green-500",
  Aadhaar: "bg-purple-500/10 text-purple-500",
  "Bank Statement": "bg-yellow-500/10 text-yellow-500",
  "Legal Notice": "bg-red-500/10 text-red-500",
  Invoice: "bg-cyan-500/10 text-cyan-500",
  Contract: "bg-orange-500/10 text-orange-500",
};

export default function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const router = useRouter();

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-card border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {document.name}
            </h3>
            <p className="text-xs text-muted-foreground">{document.size}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/documents/${document.id}`)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete?.(document.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge className={typeColors[document.type] || "bg-muted"}>
          {document.type}
        </Badge>
        <Badge
          className={
            document.status === "processed"
              ? "bg-green-500/10 text-green-500"
              : "bg-yellow-500/10 text-yellow-500"
          }
        >
          {document.status}
        </Badge>
      </div>

      <div className="text-xs text-muted-foreground">
  Uploaded {new Date(document.uploadDate).toLocaleDateString("en-GB")}
</div>
    </Card>
  );
}