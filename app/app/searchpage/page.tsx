'use client';

import { useAppStore } from "@/contexts/AppContext";
import DocumentCard from "@/components/cards/DocumentCard";

export default function SearchPage() {
  const documents = useAppStore((s) => s.documents);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const deleteDocument = useAppStore((s) => s.deleteDocument);

  // ✅ Filter by file_name
  const filtered = documents.filter((doc) => {
    const name = doc.file_name || "";
    const query = searchQuery || "";
    return name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Search results for: "{searchQuery}"
      </h1>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No documents found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
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