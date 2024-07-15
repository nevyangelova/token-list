type TokenDetail = {
    name: string;
    address: string;
    logoURI: string;
    price: number;
};

async function fetchTokenDetail(chainId: string, address: string): Promise<TokenDetail | null> {
    const res = await fetch(
        `https://li.quest/v1/token?chain=${chainId}&token=${address}`,
        {
            next: {revalidate: 10},
        }
    );
    console.log(chainId, address)

    if (!res.ok) {
        return null;
    }
    return res.json();
}

export default async function TokenDetailPage({
    params,
}: {
    params: {chainId: string; address: string};
}) {
    const {chainId, address} = params;

    const token = await fetchTokenDetail(chainId, address);

    if (!token) {
        return <div>Token not found</div>;
    }

    return (
        <div>
            <h1>{token.name}</h1>
            <img src={token.logoURI} alt={token.name} width='50' height='50' />
            <p>Address: {token.address}</p>
            <p>Price: {token.price}</p>
        </div>
    );
}
