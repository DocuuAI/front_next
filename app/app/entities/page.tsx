"use client";

import { useEffect, useState } from "react";
import { Building2, User, FileText, Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/contexts/AppContext";
import { toast } from "sonner";
import { Entity } from "@/types/entity";

export default function Entities() {
  const router = useRouter();

  const documents = useAppStore((s) => s.documents);
  const entities = useAppStore((s) => s.entities);
  const setEntities = useAppStore((s) => s.setEntities);

  /* ---------------- Local State ---------------- */
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"person" | "business">("person");
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");
  const [gst, setGst] = useState("");
  const [loading, setLoading] = useState(false);

  const businesses = entities.filter((e) => e.type === "business");
  const people = entities.filter((e) => e.type === "person");

  /* ---------------- Fetch Entities ---------------- */
  useEffect(() => {
    if (entities.length > 0) return;

    const load = async () => {
      try {
        const res = await fetch("/api/entities");
        const data = await res.json();
        setEntities(data.entities ?? []);
      } catch {
        toast.error("Failed to load entities");
      }
    };

    load();
  }, [entities.length, setEntities]);

  /* ---------------- Delete ---------------- */
  const deleteEntity = async (id: string) => {
    if (!confirm("Delete this entity?")) return;

    try {
      const res = await fetch(`/api/entities/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      setEntities(entities.filter((e) => String(e.id) !== String(id)));
      toast.success("Entity deleted");
    } catch {
      toast.error("Failed to delete entity");
    }
  };

  /* ---------------- Create ---------------- */
  const createEntity = async () => {
    if (!name.trim()) {
      toast.error("Entity name required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // ✅ FIX HERE
      setEntities([data.entity, ...entities]);

      toast.success("Entity created");
      setOpen(false);
      setName("");
      setType("person");
    } catch {
      toast.error("Failed to create entity");
    } finally {
      setLoading(false);
    }
  };


  /* ---------------- Card ---------------- */
  const EntityCard = ({ entity }: { entity: Entity }) => {
    const entityDocs = documents.filter((d) => String(d.entity_id) === entity.id);

    return (
      <Card className="p-6 space-y-4">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              {entity.type === "business" ? <Building2 /> : <User />}
            </div>
            <div>
              <h3 className="font-semibold">{entity.name}</h3>
              <p className="text-sm opacity-70">{entity.type}</p>
            </div>
          </div>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => deleteEntity(entity.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {entityDocs.length} documents
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/app/entities/${entity.id}`)}
          >
            View Profile
          </Button>
        </div>
      </Card>
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Entities</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Entity
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="business">Businesses</TabsTrigger>
          <TabsTrigger value="person">People</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="grid md:grid-cols-2 gap-4">
          {entities.map((e) => (
            <EntityCard key={e.id} entity={e} />
          ))}
        </TabsContent>

        <TabsContent value="business" className="grid md:grid-cols-2 gap-4">
          {businesses.map((e) => (
            <EntityCard key={e.id} entity={e} />
          ))}
        </TabsContent>

        <TabsContent value="person" className="grid md:grid-cols-2 gap-4">
          {people.map((e) => (
            <EntityCard key={e.id} entity={e} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Add Entity Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Entity</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <input
              className="border p-2 rounded w-full bg-zinc-900"
              placeholder="Entity name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <select
              className="border p-2 rounded w-full bg-zinc-900"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="person">Person</option>
              <option value="business">Business</option>
            </select>

            <input
              className="border p-2 rounded w-full bg-zinc-900"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              className="border p-2 rounded w-full bg-zinc-900"
              placeholder="PAN (optional)"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
            />

            {type === "business" && (
              <input
                className="border p-2 rounded w-full bg-zinc-900"
                placeholder="GST Number (optional)"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createEntity} disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}