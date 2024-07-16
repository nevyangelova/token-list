import {fetchTokenDetail, fetchTokens} from '@/api/token';
import {Metadata} from 'next';
import styles from './style.module.scss';
import defaultLogo from '/public/placeholder.png';
import Image from 'next/image';

type TokenDetailPageProps = {
    params: {
        chainId: string;
        address: string;
    };
};

export async function generateStaticParams() {
    const {tokens} = await fetchTokens();
    return tokens.slice(0, 20).map(token => ({
        chainId: token.chainId,
        address: token.address
    }));
}

export async function generateMetadata({
    params
}: TokenDetailPageProps): Promise<Metadata> {
    const {token} = await fetchTokenDetail(params.chainId, params.address);
    return {title: token ? token.name : ''};
}

export default async function TokenDetailPage({params}: TokenDetailPageProps) {
    const {chainId, address} = params;
    const {token, error} = await fetchTokenDetail(chainId, address);

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (!token) {
        return <div className={styles.errorMessage}>Token not found</div>;
    }

    return (
        <div className={styles.container}>
            <h1>{token.name}</h1>
            <Image
                src={token.logoURI || defaultLogo}
                alt={token.name}
                width="50"
                height="50"
            />
            <p>Address: {token.address}</p>
            <p>Symbol: {token.symbol}</p>
            <p>Decimals: {token.decimals}</p>
            <p>Coin Key: {token.coinKey}</p>
            <p>Price (USD): {token.priceUSD}</p>
        </div>
    );
}
