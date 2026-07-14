import { supabase } from "./supabase";

// ─── Helpers ───

export function relativeFr(iso) {
  if (!iso) return "à l'instant";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `il y a ${d} j`;
  const w = Math.floor(d / 7);
  if (w < 5) return `il y a ${w} sem`;
  const mo = Math.floor(d / 30);
  return `il y a ${mo} mois`;
}

export function todayLabel() {
  const n = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${p(n.getDate())} · ${p(n.getMonth() + 1)} · ${String(n.getFullYear()).slice(2)}`;
}

// ─── Offres ───

function rowToOffer(r) {
  return {
    id: r.id,
    client: r.client,
    secteur: r.secteur,
    project: r.project,
    date: r.date_label,
    amount: Number(r.amount),
    status: r.status,
    payload: r.payload,
  };
}

export async function fetchOffers() {
  const { data, error } = await supabase.from("offers").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(rowToOffer);
}

export async function upsertOffer(offer) {
  const row = {
    client: offer.client,
    secteur: offer.secteur,
    project: offer.project,
    date_label: offer.date,
    amount: offer.amount,
    status: offer.status,
    payload: offer.payload,
    updated_at: new Date().toISOString(),
  };
  if (offer.id) row.id = offer.id;
  const { data, error } = await supabase.from("offers").upsert(row).select().single();
  if (error) throw error;
  return rowToOffer(data);
}

export async function updateOfferStatus(id, status, patch = {}) {
  const { error } = await supabase
    .from("offers")
    .update({ status, updated_at: new Date().toISOString(), ...patch })
    .eq("id", id);
  if (error) throw error;
}

// ─── Templates ───

function rowToTemplate(r) {
  return {
    id: r.id,
    name: r.name,
    ids: r.block_ids ?? [],
    used: r.used ?? 0,
    modified: relativeFr(r.updated_at),
  };
}

export async function fetchTemplates() {
  const { data, error } = await supabase.from("templates").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return data.map(rowToTemplate);
}

export async function insertTemplate({ name, ids }) {
  const { data, error } = await supabase
    .from("templates")
    .insert({ name, block_ids: ids })
    .select()
    .single();
  if (error) throw error;
  return rowToTemplate(data);
}

export async function deleteTemplate(id) {
  const { error } = await supabase.from("templates").delete().eq("id", id);
  if (error) throw error;
}

export async function incrementTemplateUsed(t) {
  const { error } = await supabase.from("templates").update({ used: (t.used ?? 0) + 1 }).eq("id", t.id);
  if (error) throw error;
}
