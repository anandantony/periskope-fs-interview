#!/usr/bin/env node

/**
 * Database Seeder for WhatsApp Groups
 *
 * This script seeds the database with phone numbers and WhatsApp group data.
 * It includes validation checks to ensure referential integrity.
 */

import { createClient } from "@supabase/supabase-js";
import { generateWhatsAppGroups } from "./generate-large-dataset.js";
import { config } from "dotenv";

config({ path: [".env.local", ".env"] });

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables");
  console.error("   SUPABASE_URL:", supabaseUrl ? "✓" : "✗");
  console.error("   SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✓" : "✗");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const phoneNumbers = [
  { number: "+91 98765 43210", account_holder: "Internal Team A" },
  { number: "+91 91234 56789", account_holder: "Internal Team B" },
  { number: "+91 99876 54321", account_holder: "Internal Team C" },
];

async function seedPhoneNumbers() {
  console.log("📱 Seeding phone numbers...");

  try {
    // Clear existing groups but keep phone_numbers (we'll upsert)
    console.log("  Clearing existing groups...");
    await supabase.from("whatsapp_groups").delete().neq("id", 0);

    // Upsert phone numbers (insert or update on conflict by number)
    const upsertPayload = phoneNumbers.map((phone) => ({
      number: phone.number,
      status: "active",
      account_holder: phone.account_holder,
    }));

    const { error: upsertError } = await supabase
      .from("phone_numbers")
      .upsert(upsertPayload, { onConflict: "number" })
      .select();

    if (upsertError) {
      console.error("❌ Error upserting phone numbers:", upsertError.message);
      return null;
    }

    // Fetch the phone rows to return a consistent mapping
    const numbers = phoneNumbers.map((p) => p.number);
    const { data: insertedPhones, error: fetchError } = await supabase
      .from("phone_numbers")
      .select("*")
      .in("number", numbers);

    if (fetchError) {
      console.error("❌ Error fetching phone numbers:", fetchError.message);
      return null;
    }

    console.log(`✅ Ensured ${insertedPhones.length} phone numbers`);
    return insertedPhones;
  } catch (err) {
    console.error("❌ Error seeding phone numbers:", err);
    return null;
  }
}

async function seedGroups(phoneNumberMap) {
  console.log("👥 Seeding WhatsApp groups...");

  const args = process.argv.slice(2);
  const count = parseInt(args[0]) || 100; // Default 100 groups

  try {
    const groups = generateWhatsAppGroups(count);
    let successCount = 0;
    let errorCount = 0;

    // Insert groups in batches
    const batchSize = 100;
    for (let i = 0; i < groups.length; i += batchSize) {
      const batch = groups.slice(i, i + batchSize);

      const groupsToInsert = batch
        .map((group) => {
          // Find phone_id by matching phone number
          const phone = phoneNumberMap.find((p) => p.number === group.phone_number);

          if (!phone) {
            console.warn(
              `⚠️  Phone number ${group.phone_number} not found for group "${group.name}"`,
            );
            errorCount++;
            return null;
          }

          return {
            name: group.name,
            description: group.description,
            member_count: group.member_count,
            phone_id: phone.id,
            is_active: group.is_active,
            project: group.project,
            labels: group.labels,
            created_at: group.created_at,
            updated_at: group.updated_at,
          };
        })
        .filter(Boolean); // Remove null entries

      if (groupsToInsert.length === 0) continue;

      const { data, error } = await supabase
        .from("whatsapp_groups")
        .insert(groupsToInsert)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch:`, error.message);
        errorCount += groupsToInsert.length;
      } else {
        successCount += data.length;
      }
    }

    console.log(`✅ Seeded ${successCount} groups`);
    if (errorCount > 0) {
      console.warn(`⚠️  Failed to seed ${errorCount} groups`);
    }

    return successCount;
  } catch (err) {
    console.error("❌ Error seeding groups:", err);
    return 0;
  }
}

async function main() {
  console.log("🌱 Starting database seeding...\n");

  // Step 1: Seed phone numbers
  const phoneNumberMap = await seedPhoneNumbers();
  if (!phoneNumberMap) {
    console.error("❌ Seeding failed: Could not seed phone numbers");
    process.exit(1);
  }

  console.log("");

  // Step 2: Seed groups with validation
  const groupCount = await seedGroups(phoneNumberMap);

  console.log("\n✨ Seeding complete!");
  console.log(`📊 Summary:`);
  console.log(`   - Phone numbers: ${phoneNumberMap.length}`);
  console.log(`   - Groups: ${groupCount}`);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
