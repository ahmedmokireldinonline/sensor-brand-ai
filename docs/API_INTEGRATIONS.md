# Sensor Brand AI — API Integrations

## Current verified status

| Provider | UI listed | OAuth route | Callback exchange | Webhook verification | Fetch adapter | Status |
|---|---:|---:|---:|---:|---:|---|
| Meta Pages/Instagram | Yes | Placeholder | No | Meta GET challenge only; POST signature missing | No | Awaiting implementation/authorization |
| Google Business Profile | Yes | Placeholder | No | No | No | Awaiting implementation/authorization |
| Reddit | Yes | Placeholder route map | No | No | No | Awaiting implementation/authorization |
| LinkedIn | Yes | Placeholder | No | No; route/schema mismatch | No | Awaiting implementation/authorization |
| Custom Webhook | Yes | N/A | N/A | No | N/A | Awaiting signed intake design |

The live deployment returned all provider configuration flags as false from `/api/integrations/status`. No provider credential or external API call was tested.

## Required adapter contract

Each provider adapter should expose, behind a server-only interface:

- OAuth authorization URL creation with state/PKCE where required.
- Code exchange, token refresh, disconnect/revocation, and permission validation.
- Source discovery and workspace-linked source creation.
- Webhook subscription, verification, signature validation, and event normalization.
- Historical and incremental fetch with pagination and rate-limit handling.
- Stable external IDs and provider timestamps for idempotent upsert/cursor advancement.
- Redacted error classification and retryability metadata.

## Security requirements

- Provider secrets and tokens must never enter client components or localStorage.
- Store tokens encrypted or in an approved secret manager, with key rotation and audit access.
- Treat provider content as untrusted data; it must not alter system instructions or invoke tools.
- Reject unsigned, stale, duplicate, malformed, and source-unmapped events.
- Do not activate a provider until a real authorized sandbox test passes and evidence is documented.
