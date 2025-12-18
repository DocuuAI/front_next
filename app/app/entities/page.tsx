"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  User,
  FileText,
  Trash2,
  Plus,
  Phone,
  CreditCard,
  ReceiptText,
} from "lucide-react";
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

  /* ---------------- Create Entity State ---------------- */
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"person" | "business">("person");
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");
  const [gst, setGst] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- Delete Entity State ---------------- */
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<Entity | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  /* ---------------- Create Entity ---------------- */
  const createEntity = async () => {
    if (!name.trim()) {
      toast.error("Entity name required");
      return;
    }

    setLoading(true);

    try {
      const payload: any = { name, type };

      if (type === "person") {
        payload.phone = phone || undefined;
        payload.pan = pan || undefined;
      }

      if (type === "business") {
        payload.gst_number = gst || undefined;
      }

      const res = await fetch("/api/entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setEntities([data.entity, ...entities]);
      toast.success("Entity created");

      // reset
      setOpen(false);
      setName("");
      setPhone("");
      setPan("");
      setGst("");
      setType("person");
    } catch {
      toast.error("Failed to create entity");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Delete Entity ---------------- */
  const confirmDeleteEntity = (entity: Entity) => {
    setEntityToDelete(entity);
    setDeleteOpen(true);
  };

  const deleteEntity = async () => {
    if (!entityToDelete) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/entities/${entityToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setEntities(entities.filter((e) => e.id !== entityToDelete.id));
      toast.success("Entity deleted");
      setDeleteOpen(false);
      setEntityToDelete(null);
    } catch {
      toast.error("Failed to delete entity");
    } finally {
      setDeleting(false);
    }
  };

  /* ---------------- Entity Card ---------------- */
  const EntityCard = ({ entity }: { entity: Entity }) => {
    const entityDocs = documents.filter(
      (d) => String(d.entity_id) === String(entity.id)
    );

    return (
      <Card className="p-5 space-y-4 hover:shadow-lg transition">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              {entity.type === "business" ? (
                <Building2 className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>

            <div>
              <h3 className="font-semibold text-lg">{entity.name}</h3>
              <p className="text-xs uppercase opacity-60 tracking-wide">
                {entity.type}
              </p>
            </div>
          </div>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => confirmDeleteEntity(entity)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          {entity.type === "person" && entity.phone && (
            <div className="flex items-center gap-2 opacity-80">
              <Phone className="w-4 h-4" />
              {entity.phone}
            </div>
          )}

          {entity.type === "person" && entity.pan && (
            <div className="flex items-center gap-2 opacity-80">
              <CreditCard className="w-4 h-4" />
              PAN: {entity.pan}
            </div>
          )}

          {entity.type === "business" && entity.gst && (
            <div className="flex items-center gap-2 opacity-80">
              <ReceiptText className="w-4 h-4" />
              GST: {entity.gst}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t text-sm">
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

      {/* Create Entity Dialog */}
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

            {type === "person" && (
              <>
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
              </>
            )}

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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">
              Delete Entity
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm">
            Delete <strong>{entityToDelete?.name}</strong>? This cannot be undone.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteEntity}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}