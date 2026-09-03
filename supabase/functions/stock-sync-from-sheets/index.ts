// ⚡️ Ponytail mode: full — lazy senior dev, minimum that works.
// This edge function pulls stockGeneral from the client's Google Sheet
// (elprofetacontrolstock) and upserts it into Supabase products_variant.stock.
// Runs via cron every 5–15 min. Keeps dashboard stock "stale but safe".
// Ceiling: stock can be up to 15 min stale. Upgrade path: add stock_con/stock_sin
// columns + stock_movements table for full audit.

import "@supabase/functions-js/edge-runtime.d.ts"
import { createClient, SupabaseClient } from "@supabase/supabase-js"

const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycby7ZfA_-VqqYL0cG-we3cUmP1kaKTY_4D3l5VjfjqIg2jFwbwy8vx1W5r_jsmT9Si-QrA/exec"

// 6 base styles from elprofetacontrolstock (must match products_variant.title or sku)
const ESTILOS_BASE = ["BLONDE", "IRISH RED", "STOUT", "SESSION IPA", "RED IPA", "HONEY"]

export async function onRequest(context: any) {
  try {
    // 1️⃣ Fetch stockGeneral from Google Sheet
    const resp = await fetch(`${SHEETS_URL}?accion=stockGeneral&v=${Date.now()}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
    })

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: `Sheets HTTP ${resp.status}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      )
    }

    const texto = await resp.text()
    const datos = JSON.parse(texto.trim().replace(/^﻿/, ""))

    if (!datos.stockGeneral) {
      return new Response(
        JSON.stringify({ error: "No stockGeneral in Sheets response" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const stockGeneral = datos.stockGeneral

    // 2️⃣ Initialize Supabase client for this edge function
    const supabase: SupabaseClient = createClient(
      context.supabaseUrl!,
      context.supabaseKey!
    )

    // 3️⃣ Upsert each style stock into products_variant
    // Minimum viable approach: update rows where title matches the style name exactly.
    // This assumes products_variant.title values are exactly "BLONDE", "IRISH RED", etc.
    // If your variants have different titles (e.g. "Blonde Ale 473ml"), adjust ESTILOS_BASE
    // or update the schema so titles match these 6 keywords.
    const updatePromises = ESTILOS_BASE.map((estilo) => {
      const cantidad = Number(stockGeneral[estilo]) || 0
      // Use PATCH with a filter on title — this is the "deliberate simplification" ceiling.
      // If titles don't match, no rows get updated (safe failure, not a crash).
      return supabase
        .from("products_variant")
        .update({ stock: cantidad })
        .eq("title", estilo)
    })

    const results = await Promise.allSettled(updatePromises)

    const failed = results.flatMap((r) => {
      const err = r.status === "rejected" ? r.reason : r.value?.error
      return err ? [err as Error] : []
    })

    return new Response(
      JSON.stringify({
        ok: failed.length === 0,
        syncedEstilos: ESTILOS_BASE.length,
        failedCount: failed.length,
        details: failed.map((r) => r?.message || "unknown error"),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (err) {
    console.error("❌ stock-sync-from-sheets error:", err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}