export type Token = {
    name: string;
    address: string;
    logoURI: string;
    chainId: string;
    symbol: string;
    decimals: number;
    coinKey: string;
    priceUSD: string;
};

export async function fetchTokens(): Promise<{
    tokens: Token[];
    error: string | null;
}> {
    try {
        const res = await fetch('https://li.quest/v1/tokens');
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await res.json();
        const tokens = Object.keys(data.tokens).flatMap(chainId =>
            data.tokens[chainId].map((token: any) => ({
                ...token,
                chainId
            }))
        );
        return {tokens, error: null};
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {tokens: [], error: error.message};
        }
        return {tokens: [], error: 'An unknown error occurred'};
    }
}

export async function fetchTokenDetail(
    chainId: string,
    address: string
): Promise<{token: Token | null; error: string | null}> {
    try {
        const res = await fetch(
            `https://li.quest/v1/token?chain=${chainId}&token=${address}`,
            {
                next: {revalidate: 10}
            }
        );

        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        const token = await res.json();
        return {token, error: null};
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {token: null, error: error.message};
        }
        return {token: null, error: 'An unknown error occurred'};
    }
}
