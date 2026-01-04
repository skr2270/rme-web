import FeedbackClient from './FeedbackClient';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FeedbackPage({ searchParams }: Props) {
  const sp = searchParams ? await searchParams : undefined;
  const rawBusinessId =
    (typeof sp?.business_id === 'string' ? sp?.business_id : undefined) ||
    (typeof sp?.businessId === 'string' ? sp?.businessId : undefined) ||
    null;

  const rawLocationId =
    (typeof sp?.location_id === 'string' ? sp?.location_id : undefined) ||
    (typeof sp?.locationId === 'string' ? sp?.locationId : undefined) ||
    null;

  return <FeedbackClient businessId={rawBusinessId} initialLocationId={rawLocationId} />;
}
