'use client';

import {useEffect, useState} from 'react';
import {Token} from '@/api/token';
import {useTokenContext} from '@/context/TokenContext';
import styles from './style.module.scss';
import Image from 'next/image';
import defaultLogo from '/public/placeholder.png';
import favoriteIcon from '/public/fav_button.png';

type TokenDetailClientComponentProps = {
    token: Token;
    error: string | null;
};

export function TokenDetailClientComponent({
    token,
    error
}: TokenDetailClientComponentProps) {
    const {favoriteTokens, toggleFavorite} = useTokenContext();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        setIsFavorite(favoriteTokens.some(t => t.address === token.address));
    }, [favoriteTokens, token.address]);

    if (error) {
        return <div>{error}</div>;
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
            <button
                onClick={() => toggleFavorite(token)}
                className={styles.favoriteButton}
            >
                {isFavorite && (
                    <Image
                        src={favoriteIcon}
                        alt="Favorite"
                        width="20"
                        height="20"
                    />
                )}
                {isFavorite ? 'Unfavorite' : 'Favorite'}
            </button>
        </div>
    );
}
