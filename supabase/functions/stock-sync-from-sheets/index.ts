// ⚡️ Ponytail mode: full — minimum that works.
// Sheet = precio+stock (configuracion + stockGeneral) → Supabase products.
// Supabase owns descripcion/images/abv/ibu; this sync solo pisa stock+price+attributes.price_tiers.
// ponytail: tiers globales (minorista/six/doce), per-style si Configuracion los agrega por clave

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
    const configuracion = (datos as any).configuracion || {}
    const priceTiers = {
      minorista: Number(configuracion.precioMinorista) || 3500,
      six: Number(configuracion.precioSixPack) || 3250,
      doce: Number(configuracion.precioDocePack) || 3000,
    }

    // 2️⃣ Initialize Supabase client
    const supabase: SupabaseClient = createClient(
      context.supabaseUrl!,
      context.supabaseKey!
    )

    // Resolve tenant id for slug el-profeta (ponytail: 1 tenant prod; upgrade to slug param si multi-tenant)
    const { data: tenant } = await supabase.from("tenants").select("id").eq("slug", "el-profeta").maybeSingle()
    const tenantId = (tenant as any)?.id
    if (!tenantId) {
      return new Response(JSON.stringify({ error: "tenant el-profeta no existe — correr seed primero" }), { status: 500, headers: { "Content-Type": "application/json" } })
    }

    // 3️⃣ Sync stock+price_tiers into products (slug = estilo lowercased, e.g. blonde, red-ipa)
    // Solo pisa stock/price/attributes.price_tiers; descripcion/images/abv/ibu quedan en Supabase.
    const SLUG_MAP: Record<string, string> = {
      BLONDE: "blonde",
      HONEY: "honey",
      STOUT: "stout",
      "IRISH RED": "irish-red",
      "RED IPA": "red-ipa",
      "SESSION IPA": "session-ipa",
    }
    const updatePromises = ESTILOS_BASE.map(async (estilo) => {
      const slug = SLUG_MAP[estilo]
      const cantidad = Number(stockGeneral[estilo]) || 0
      const { data: existing } = await supabase.from("products").select("id, attributes").eq("tenant_id", tenantId).eq("slug", slug).maybeSingle()
      const mergedAttributes = { ...((existing as any)?.attributes || {}), price_tiers: priceTiers }
      if ((existing as any)?.id) {
        return supabase.from("products").update({ stock: cantidad, price: priceTiers.minorista, attributes: mergedAttributes }).eq("id", (existing as any).id)
      }
      // ponytail: si no existe producto, no lo crea el sync (seed lo hace); falla silenciosa para no inventar descripcion
      return { error: null } as any
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