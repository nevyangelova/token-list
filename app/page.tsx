import ClientOverview from '@/components/ClientOverview';
import {fetchTokens} from '@/api/token';

export default async function OverviewPage() {
    const tokens = await fetchTokens();

    return <ClientOverview tokens={tokens} initialSearchQuery={''} />;
}
