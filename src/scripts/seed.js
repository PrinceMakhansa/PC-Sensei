import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

/**
 * PCSensei — Component Seed Script
 * 
 * Pulls data from docyx/pc-part-dataset (GitHub raw JSON)
 * and seeds your MongoDB components collection.
 * 
 * Usage:
 *   node src/scripts/seed.js             → seeds all categories
 *   node src/scripts/seed.js cpu gpu     → seeds specific categories only
 * 
 * Run once to populate, re-run anytime to refresh.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
const BASE_URL =
  "https://raw.githubusercontent.com/docyx/pc-part-dataset/main/data/json";

// Map our category names → dataset filenames
const CATEGORIES = {
  cpu: "cpu",
  "cpu-cooler": "cpu-cooler",
  motherboard: "motherboard",
  memory: "memory",
  storage: "internal-hard-drive",
  "video-card": "video-card",
  case: "case",
  "power-supply": "power-supply",
  monitor: "monitor",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function extractBrand(name) {
  if (!name) return null;
  const brands = [
    "AMD", "Intel", "NVIDIA", "ASUS", "MSI", "Gigabyte", "ASRock",
    "Corsair", "G.Skill", "Kingston", "Crucial", "Samsung", "Seagate",
    "Western Digital", "NZXT", "Fractal Design", "be quiet!", "Seasonic",
    "EVGA", "Zotac", "Sapphire", "XFX", "PowerColor", "Noctua",
    "Cooler Master", "Thermaltake", "Lian Li", "DeepCool",
  ];
  return brands.find((b) => name.startsWith(b)) || name.split(" ")[0];
}

// Build a plain-text description Gemini can read
function buildDescription(category, part) {
  const specs = part.specs || {};
  const lines = [`${part.name}`];

  switch (category) {
    case "cpu":
      if (specs.core_count) lines.push(`${specs.core_count} cores`);
      if (specs.boost_clock) lines.push(`${specs.boost_clock} boost clock`);
      if (specs.tdp) lines.push(`${specs.tdp}W TDP`);
      if (specs.socket) lines.push(`Socket ${specs.socket}`);
      break;
    case "video-card":
      if (specs.memory) lines.push(`${specs.memory} VRAM`);
      if (specs.boost_clock) lines.push(`${specs.boost_clock} boost clock`);
      if (specs.tdp) lines.push(`${specs.tdp}W TDP`);
      break;
    case "memory":
      if (specs.speed) lines.push(`${specs.speed} speed`);
      if (specs.modules) lines.push(`${specs.modules}`);
      if (specs.type) lines.push(specs.type);
      break;
    case "motherboard":
      if (specs.socket) lines.push(`Socket ${specs.socket}`);
      if (specs.form_factor) lines.push(specs.form_factor);
      if (specs.memory_max) lines.push(`Max ${specs.memory_max} RAM`);
      break;
    case "storage":
      if (specs.capacity) lines.push(specs.capacity);
      if (specs.type) lines.push(specs.type);
      if (specs.interface) lines.push(specs.interface);
      break;
    case "power-supply":
      if (specs.wattage) lines.push(`${specs.wattage}W`);
      if (specs.efficiency_rating) lines.push(specs.efficiency_rating);
      if (specs.modular) lines.push(specs.modular);
      break;
    default:
      break;
  }

  if (part.price) lines.push(`$${part.price}`);
  return lines.join(", ");
}

// ─── Fetch & Transform ──────────────────────────────────────────────────────

async function fetchCategory(category, filename) {
  const url = `${BASE_URL}/${filename}.json`;
  console.log(`  Fetching ${category}...`);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);

  const data = await res.json();
  const parts = Array.isArray(data) ? data : data.parts || [];

  return parts
    .filter((p) => p.name) // skip empty entries
    .map((p) => ({
      name: p.name,
      brand: extractBrand(p.name),
      category,
      price: p.price ?? null,
      specs: { ...p },        // store all raw specs as-is
      description: buildDescription(category, { name: p.name, specs: p, price: p.price }),
      source: "pc-part-dataset",
      imageUrl: null,
      isActive: true,
    }));
}

// ─── Seed ───────────────────────────────────────────────────────────────────

async function seed() {
  if (!MONGODB_URI) {
    console.error("❌  MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  // Decide which categories to seed
  const args = process.argv.slice(2);
  const toSeed =
    args.length > 0
      ? Object.fromEntries(
          args
            .filter((a) => CATEGORIES[a])
            .map((a) => [a, CATEGORIES[a]])
        )
      : CATEGORIES;

  if (Object.keys(toSeed).length === 0) {
    console.error("❌  No valid categories provided. Valid options:", Object.keys(CATEGORIES).join(", "));
    process.exit(1);
  }

  console.log("\n🔌  Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅  Connected\n");

  // Dynamically import model (ES module)
  const { Component } = await import("../models/Component.js");

  let totalInserted = 0;

  for (const [category, filename] of Object.entries(toSeed)) {
    try {
      const components = await fetchCategory(category, filename);

      if (components.length === 0) {
        console.log(`  ⚠️  No data for ${category}, skipping`);
        continue;
      }

      // Upsert by name + category — safe to re-run
      const ops = components.map((c) => ({
        updateOne: {
          filter: { name: c.name, category: c.category },
          update: { $set: c },
          upsert: true,
        },
      }));

      const result = await Component.bulkWrite(ops);
      const count = result.upsertedCount + result.modifiedCount;
      totalInserted += count;
      console.log(`  ✅  ${category}: ${components.length} parts (${result.upsertedCount} new, ${result.modifiedCount} updated)`);
    } catch (err) {
      console.error(`  ❌  ${category} failed:`, err.message);
    }
  }

  console.log(`\n🎉  Done! ${totalInserted} components seeded.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});