import {fetchTokenDetail, fetchTokens} from '@/api/token';
import {Metadata} from 'next';

type TokenDetailPageProps = {
    params: {
        chainId: string;
        address: string;
    };
};

export async function generateStaticParams() {
    const tokens = await fetchTokens();
    return tokens.slice(0, 20).map((token) => ({
        chainId: token.chainId,
        address: token.address,
    }));
}

export async function generateMetadata({
    params,
}: TokenDetailPageProps): Promise<Metadata> {
    const token = await fetchTokenDetail(params.chainId, params.address);
    return {title: token ? token.name : 'Token not found'};
}

export default async function TokenDetailPage({params}: TokenDetailPageProps) {
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
