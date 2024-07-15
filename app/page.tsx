import ClientOverview from '@/components/ClientOverview';

type Token = {
    name: string;
    address: string;
    logoURI: string;
    chainId: string;
};

async function fetchTokens(): Promise<Token[]> {
    const res = await fetch('https://li.quest/v1/tokens');
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    const data = await res.json();
    const tokens = Object.keys(data.tokens).flatMap((chainId) =>
        data.tokens[chainId].map((token: any) => ({
            ...token,
            chainId,
        }))
    );
    return tokens;
}

export default async function OverviewPage() {
    const tokens = await fetchTokens();

    return <ClientOverview tokens={tokens} initialSearchQuery={''} />;
}
