import ClientOverview from '@/components/Overview/ClientOverview';
import { fetchTokens } from '@/api/token';

export default async function OverviewPage() {
    const { tokens, error } = await fetchTokens();

    return <ClientOverview tokens={tokens} error={error} initialSearchQuery={''} />;
}
