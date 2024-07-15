'use client';

import {Token} from '@/api/token';
import {useTokenContext} from '@/context/TokenContext';
import styles from './style.module.scss';
import Image from 'next/image';

type TokenDetailClientComponentProps = {
    token: Token;
};

export function TokenDetailClientComponent({
    token
}: TokenDetailClientComponentProps) {
    const {favoriteTokens, toggleFavorite} = useTokenContext();
    const isFavorite = favoriteTokens.some(t => t.address === token.address);

    return (
        <div className={styles.container}>
            <h1>{token.name}</h1>
            <Image
                src={token.logoURI}
                alt={token.name}
                width="50"
                height="50"
            />
            <p>Address: {token.address}</p>
            <p>Symbol: {token.symbol}</p>
            <p>Decimals: {token.decimals}</p>
            <p>Coin Key: {token.coinKey}</p>
            <p>Price (USD): {token.priceUSD}</p>
            <button onClick={() => toggleFavorite(token)}>
                {isFavorite ? 'Unfavorite' : 'Favorite'}
            </button>
        </div>
    );
}
