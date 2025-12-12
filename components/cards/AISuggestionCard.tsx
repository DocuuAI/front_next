"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AISuggestion } from "@/lib/mockData";
import { useRouter } from "next/navigation";

interface AISuggestionCardProps {
  suggestion: AISuggestion;
}

export default function AISuggestionCard({ suggestion }: AISuggestionCardProps) {
  const router = useRouter();

  return (
    <Card className="p-4 bg-linear-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-foreground mb-1">
            {suggestion.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {suggestion.description}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between text-primary hover:text-primary hover:bg-primary/10"
        onClick={() => router.push(suggestion.actionUrl)}
      >
        <span>{suggestion.actionLabel}</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </Card>
  );
}