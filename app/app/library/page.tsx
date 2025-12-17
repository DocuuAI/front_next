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

  // ✅ SAFE FILTER
  const filteredDocuments = documents.filter((doc) => {
    const name = doc.file_name ?? '';
    const type = doc.file_type ?? '';

    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterType === 'all' || type === filterType)
    );
  });

  // ✅ SAFE NON-NULL TYPES
  const documentTypes: string[] = [
    'all',
    ...Array.from(
      new Set(
        documents
          .map((d) => d.file_type)
          .filter((t): t is string => typeof t === 'string')
      )
    ),
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Document Library</h1>
          <p className="text-muted-foreground">
            {filteredDocuments.length} documents found
          </p>
        </div>

        <Link href="/app/upload">
          <Button>Upload Document</Button>
        </Link>
      </div>

      {/* Search + Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              size="icon"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Category Badges */}
      <div className="flex flex-wrap gap-2">
        {documentTypes.map((type) => (
          <Badge
            key={type}
            variant={filterType === type ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilterType(type)}
          >
            {type === 'all' ? 'All' : type}
          </Badge>
        ))}
      </div>

      {/* Documents */}
      {filteredDocuments.length === 0 ? (
        <Card className="p-12 text-center">
          <Filter className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No documents found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDelete={() => deleteDocument(doc.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}