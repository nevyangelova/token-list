import ClientOverview from '@/components/Overview/ClientOverview';
import {fetchTokens} from '@/api/token';

export default async function OverviewPage() {
    const tokens = await fetchTokens();

    return <ClientOverview tokens={tokens} initialSearchQuery={''} />;
}
