'use client';
import { useAppStore } from "@/contexts/AppContext";

export default function SearchPage() {
  const documents = useAppStore((s) => s.documents);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const filtered = documents.filter(doc => {
    const title = doc?.title || "";
    const query = searchQuery || "";
    return title.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Search results for: "{searchQuery}"
      </h1>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No documents found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => (
            <div key={doc.id}>{doc.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}