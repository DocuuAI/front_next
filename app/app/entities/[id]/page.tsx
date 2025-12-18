"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { FileText, Phone, Building2, User, ArrowLeft } from "lucide-react";

import { useAppStore } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Entity } from "@/types/entity";

type FormState = {
  name: string;
  phone?: string;
  pan?: string;
  gst_number?: string;
};

export default function EntityProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const entities = useAppStore((s) => s.entities);
  const documents = useAppStore((s) => s.documents);
  const updateEntity = useAppStore((s) => s.updateEntity);
  const setEntities = useAppStore((s) => s.setEntities);

  const [entity, setEntity] = useState<Entity | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Hydrate ---------------- */
  const hydrate = useCallback((ent: Entity) => {
    setEntity(ent);
    setForm({
      name: ent.name,
      phone: ent.phone ?? "",
      pan: ent.pan ?? "",
      gst_number: ent.gst ?? "",
    });
    setLoading(false);
  }, []);

  /* ---------------- Load Entity ---------------- */
  useEffect(() => {
    if (!id) return;

    const fromStore = entities.find((e: Entity) => e.id === id);
    if (fromStore) {
      hydrate(fromStore);
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`/api/entities/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error();

        // IMPORTANT: Use direct array for setEntities, not function updater unless supported
        const filtered = entities.filter((e: Entity) => e.id !== id);
        setEntities([...filtered, data.entity]);

        hydrate(data.entity);
      } catch {
        toast.error("Failed to load entity");
        setLoading(false);
      }
    };

    load();
  }, [id, entities, hydrate, setEntities]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!entity || !form) return <p className="p-6">Entity not found</p>;

  const entityDocs = documents.filter(
    (d) => String(d.entity_id) === String(entity.id)
  );

  /* ---------------- Save ---------------- */
  const save = async () => {
    try {
      const payload = {
        name: form.name,
        phone: form.phone || undefined,
        pan: entity.type === "person" ? form.pan || undefined : undefined,
        gst_number:
          entity.type === "business" ? form.gst_number || undefined : undefined,
      };

      const res = await fetch(`/api/entities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      updateEntity(entity.id, data.entity);
      toast.success("Entity updated");
      router.back();
    } catch {
      toast.error("Failed to update entity");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Entity Profile</h1>
      </div>

      {/* Entity Info */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            {entity.type === "business" ? <Building2 /> : <User />}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{entity.name}</h2>
            <p className="text-sm opacity-70 capitalize">{entity.type}</p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Name"
            value={form.name}
            onChange={(v) => setForm({ ...form!, name: v })}
          />

          <Field
            label="Phone"
            icon={<Phone className="w-4 h-4" />}
            value={form.phone ?? ""}
            onChange={(v) => setForm({ ...form!, phone: v })}
          />

          {entity.type === "person" && (
            <Field
              label="PAN"
              value={form.pan ?? ""}
              onChange={(v) => setForm({ ...form!, pan: v })}
            />
          )}

          {entity.type === "business" && (
            <Field
              label="GST Number"
              value={form.gst_number ?? ""}
              onChange={(v) => setForm({ ...form!, gst_number: v })}
            />
          )}
        </div>

        <Button onClick={save}>Save Changes</Button>
      </Card>

      {/* Documents */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Linked Documents ({entityDocs.length})
        </h3>

        {entityDocs.length === 0 ? (
          <p className="text-sm opacity-70">No documents linked to this entity.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {entityDocs.map((doc) => (
              <Card key={doc.id} className="p-4 hover:shadow-lg transition">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6" />
                  <div className="flex-1">
                    <p className="font-medium truncate">{doc.file_name}</p>
                    <p className="text-xs opacity-70">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => window.open(doc.file_url, "_blank")}
                >
                  View
                </Button>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------------- Small Field Component ---------------- */
function Field({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm opacity-70 flex items-center gap-1">
        {icon}
        {label}
      </label>
      <input
        className="border p-2 w-full bg-zinc-900 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}