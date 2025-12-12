'use client';
import { useState } from 'react';
import { Grid, List, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DocumentCard from '@/components/cards/DocumentCard';
import Link from 'next/link';
import { useAppStore } from '@/contexts/AppContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Library() {
  const documents = useAppStore((s) => s.documents);
  const deleteDocument = useAppStore((s) => s.deleteDocument);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const documentTypes = ['all', ...Array.from(new Set(documents.map(d => d.type)))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Document Library</h1>
          <p className="text-muted-foreground">
            {filteredDocuments.length} documents found
          </p>
        </div>
        <Link href="/upload">
        <Button>Upload Document</Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="p-4 bg-card border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Document Categories */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filterType === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilterType('all')}
        >
          All ({documents.length})
        </Badge>
        {Array.from(new Set(documents.map(d => d.type))).map(type => (
          <Badge
            key={type}
            variant={filterType === type ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilterType(type)}
          >
            {type} ({documents.filter(d => d.type === type).length})
          </Badge>
        ))}
      </div>

      {/* Documents Grid/List */}
      {filteredDocuments.length === 0 ? (
        <Card className="p-12 bg-card border-border text-center">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No documents found
          </h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
        }>
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onDelete={deleteDocument} />
          ))}
        </div>
      )}
    </div>
  );
}