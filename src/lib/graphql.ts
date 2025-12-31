export type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

const DEFAULT_ENDPOINT = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://103.160.106.186:3000/graphql';

export async function graphqlRequest<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  operationName?: string,
): Promise<TData> {
  const res = await fetch(DEFAULT_ENDPOINT, {
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
