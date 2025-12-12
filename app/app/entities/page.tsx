'use client';
import { Building2, User, AlertTriangle, FileText, Mail, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/contexts/AppContext';

export default function Entities() {
  const documents = useAppStore((s) => s.documents);
  const entities = useAppStore((s) => s.entities);
  const businesses = entities.filter(e => e.type === 'business');
  const people = entities.filter(e => e.type === 'person');

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/10 text-red-500';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'low': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const EntityCard = ({ entity }: { entity: typeof entities[0] }) => {
    const entityDocs = documents.filter(d => entity.documents.includes(d.id));
    
    return (
      <Card className="p-6 bg-card border-border hover:shadow-lg transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              {entity.type === 'business' ? (
                <Building2 className="w-6 h-6 text-primary" />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{entity.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{entity.type}</p>
            </div>
          </div>
          <Badge className={getRiskColor(entity.riskLevel)}>
            {entity.riskLevel} risk
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {entity.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{entity.email}</span>
            </div>
          )}
          {entity.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{entity.phone}</span>
            </div>
          )}
          {entity.pan && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">PAN:</span>
              <span className="font-mono text-foreground">{entity.pan}</span>
            </div>
          )}
          {entity.gst && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">GST:</span>
              <span className="font-mono text-foreground">{entity.gst}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>{entityDocs.length} documents</span>
          </div>
          <Button variant="outline" size="sm">
            View Profile
          </Button>
        </div>

        {entity.riskLevel === 'high' && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
            <p className="text-xs text-red-500">
              Requires immediate attention - Legal notice pending
            </p>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Entity Management</h1>
        <p className="text-muted-foreground">
          Manage people and businesses with their associated documents
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Entities</p>
          <p className="text-2xl font-bold text-foreground">{entities.length}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Businesses</p>
          <p className="text-2xl font-bold text-foreground">{businesses.length}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">People</p>
          <p className="text-2xl font-bold text-foreground">{people.length}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">High Risk</p>
          <p className="text-2xl font-bold text-red-500">
            {entities.filter(e => e.riskLevel === 'high').length}
          </p>
        </Card>
      </div>

      {/* Entities List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({entities.length})</TabsTrigger>
          <TabsTrigger value="businesses">Businesses ({businesses.length})</TabsTrigger>
          <TabsTrigger value="people">People ({people.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entities.map(entity => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="businesses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businesses.map(entity => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="people" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {people.map(entity => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}