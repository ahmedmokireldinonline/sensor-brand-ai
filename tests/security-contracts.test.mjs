import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("sync route derives identity from the authenticated session", async () => {
  const source = await read("app/api/sync/run/route.ts");
  assert.match(source, /getAuthenticatedUser/);
  assert.match(source, /requested_by: user\.id/);
  assert.doesNotMatch(source, /input\.workspace_id|input\.requested_by/);
});

test("webhook route verifies raw-body HMAC and rejects unknown sources", async () => {
  const source = await read("app/api/webhooks/[provider]/route.ts");
  assert.match(source, /createHmac/);
  assert.match(source, /timingSafeEqual/);
  assert.match(source, /Unknown webhook source/);
  assert.match(source, /await request\.text\(\)/);
});

test("auth callback has an allowlisted redirect", async () => {
  const source = await read("app/auth/callback/route.ts");
  assert.match(source, /allowedRedirects/);
  assert.match(source, /allowedRedirects\.has\(requested\)/);
});

test("integration settings do not persist credentials in browser storage", async () => {
  const source = await read("app/settings/integrations/page.tsx");
  assert.doesNotMatch(source, /sensor-api-configs/);
});
