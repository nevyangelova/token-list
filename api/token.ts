export type Token = {
    name: string;
    address: string;
    logoURI: string;
    chainId: string;
};

export type TokenDetail = {
    name: string;
    address: string;
    logoURI: string;
    price: number;
};

const API_URL = 'https://li.quest/v1/tokens';

export async function fetchTokens(): Promise<Token[]> {
    const res = await fetch(API_URL);
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

export async function fetchTokenDetail(
    chainId: string,
    address: string
): Promise<TokenDetail | null> {
    const res = await fetch(
        `https://li.quest/v1/token?chain=${chainId}&token=${address}`,
        {
            next: {revalidate: 10},
        }
    );

    if (!res.ok) {
        return null;
    }
    return res.json();
}
