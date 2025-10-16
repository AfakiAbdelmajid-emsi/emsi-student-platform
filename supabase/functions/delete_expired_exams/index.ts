// index.ts

import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (_req) => {
  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_KEY")!
  );

  const today = new Date().toISOString();

  const { error } = await client
    .from("exams")
    .delete()
    .lt("date", today); // Assumes your 'exams' table has a 'date' column

  if (error) {
    return new Response(JSON.stringify({ success: false, error }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true, message: "Expired exams deleted." }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
