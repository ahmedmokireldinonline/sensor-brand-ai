type SupabaseConfig = {
  url: string;
  key: string;
};

function getConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing");
  return { url: url.replace(/\/$/, ""), key };
}

export async function insertSupabaseRow(table: string, row: Record<string, unknown>) {
  const config = getConfig();
  const response = await fetch(`${config.url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation,resolution=ignore-duplicates",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase insert failed with status ${response.status}`);
  }
  return response.json();
}
