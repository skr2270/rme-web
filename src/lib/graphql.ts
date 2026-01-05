export type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

function resolveGraphqlEndpoint(): string {
  // Default to same-origin proxy to avoid mixed-content/CORS issues.
  // Next.js rewrites should forward /graphql to the backend.
  const fallback = '/graphql';

  // Allow explicit HTTPS endpoint override (safe from HTTPS pages).
  const publicBackend = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  if (publicBackend) {
    if (publicBackend.startsWith('/')) return publicBackend;
    if (publicBackend.startsWith('https://')) {
      const trimmed = publicBackend.replace(/\/$/, '');
      return trimmed.endsWith('/graphql') ? trimmed : `${trimmed}/graphql`;
    }
    // Ignore http:// here; it will be blocked as mixed content in browsers.
  }

  // On the server, allow BACKEND_URL (can be http) for SSR/CLI usage.
  if (typeof window === 'undefined') {
    const serverBackend = process.env.BACKEND_URL || '';
    if (serverBackend) {
      const trimmed = serverBackend.replace(/\/$/, '');
      return trimmed.endsWith('/graphql') ? trimmed : `${trimmed}/graphql`;
    }
  }

  return fallback;
}

export async function graphqlRequest<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  operationName?: string,
): Promise<TData> {
  const endpoint = resolveGraphqlEndpoint();
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables, operationName }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed (${res.status})`);
  }

  const payload = (await res.json()) as GraphQLResponse<TData>;
  if (payload?.errors?.length) {
    throw new Error(payload.errors[0]?.message || 'GraphQL error');
  }

  if (!payload.data) {
    throw new Error('GraphQL response missing data');
  }

  return payload.data;
}

export function normalizeIndianPhone(input: string): string {
  const raw = (input || '').trim();
  if (!raw) return raw;
  if (raw.startsWith('+')) return raw;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return raw;
}
