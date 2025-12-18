'use client';

import { Sparkles, TrendingUp, FileText, Users, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DocumentCard from '@/components/cards/DocumentCard';
import DeadlineCard from '@/components/cards/DeadlineCard';
import AISuggestionCard from '@/components/cards/AISuggestionCard';
import { useUserStore } from "@/services/useUserStore";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from "@/contexts/AppContext";

export default function Dashboard() {
  
  const profile = useUserStore((state) => state.profile);
  const documents = useAppStore((s) => s.documents);
  const deadlines = useAppStore((s) => s.deadlines);
  const aiSuggestions = useAppStore((s) => s.aiSuggestions);
  const deleteDocument = useAppStore((s) => s.deleteDocument);
  const entities = useAppStore((s) => s.entities);  // <-- Added entities from store

  console.log("PROFILE FROM SUPABASE STORE:", profile);

  // Document stats
  const totalDocs = documents.length;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const docsThisMonth = documents.filter(
    (d) => new Date(d.created_at) >= startOfMonth
  ).length;

  const docsLastMonth = documents.filter(
    (d) => {
      const date = new Date(d.created_at);
      return date >= startOfPrevMonth && date <= endOfPrevMonth;
    }
  ).length;

  // Entity stats
  const totalEntities = entities.length;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const newEntitiesCount = entities.filter((e) => {
    const createdAt = new Date(e.created_at);
    return createdAt >= sevenDaysAgo;
  }).length;

  const growth =
    docsLastMonth === 0
      ? 100
      : Math.round(((docsThisMonth - docsLastMonth) / docsLastMonth) * 100);

  const router = useRouter();

  const recentDocuments = documents.slice(0, 6);
  const upcomingDeadlines = deadlines.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* AI Assistant Banner */}
      <Card className="p-6 bg-linear-to-r from-primary/20 via-primary/10 to-transparent border-primary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">
                {profile ? `Hi ${profile.first_name}!` : "Hi!"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Ask me anything about your documents, compliance, or deadlines
              </p>
            </div>
          </div>
          
          <Button onClick={() => router.push('/app/chat')} size="lg">Start Chat</Button>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Documents</p>
              <p className="text-2xl font-bold text-foreground">{totalDocs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div
            className="flex items-center gap-1 mt-2 text-xs"
            style={{ color: growth >= 0 ? 'green' : 'red' }}
          >
            <TrendingUp className="w-3 h-3" />
            <span>{growth >= 0 ? '+' : ''}{growth}% this month</span>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Entities</p>
              <p className="text-2xl font-bold text-foreground">{totalEntities}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
            <TrendingUp className="w-3 h-3" />
            <span>{newEntitiesCount > 0 ? `+${newEntitiesCount} new` : 'No new entities'}</span>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Deadlines</p>
              <p className="text-2xl font-bold text-foreground">{deadlines.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-yellow-500">
            <span>3 due this week</span>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">AI Suggestions</p>
              <p className="text-2xl font-bold text-foreground">{aiSuggestions.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-purple-500">
            <span>Review now</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Recent Documents</h2>
            <Button variant="ghost">
                <Link href="/app/library">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={() => deleteDocument(doc.id)}
              />
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Upcoming Deadlines</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <DeadlineCard key={deadline.id} deadline={deadline} />
            ))}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">AI Suggestions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiSuggestions.map((suggestion) => (
            <AISuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      </div>
    </div>
  );
}