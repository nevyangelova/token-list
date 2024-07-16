'use client';

import {useState, useEffect, useCallback} from 'react';
import Link from 'next/link';
import {List, AutoSizer} from 'react-virtualized';
import {useTokenContext} from '../../context/TokenContext';
import {Token} from '@/api/token';
import styles from './style.module.scss';
import defaultLogo from '/public/placeholder.png';
import Image from 'next/image';
import favoriteIcon from '/public/favorite.png';

type ClientOverviewProps = {
    tokens: Token[];
    initialSearchQuery: string;
    error: string | null;
};

const ITEMS_PER_PAGE = 20;

export default function ClientOverview({
    tokens,
    initialSearchQuery,
    error
}: ClientOverviewProps) {
    const {setSearchQuery, setTokens, favoriteTokens} = useTokenContext();
    const [search, setSearch] = useState(initialSearchQuery);
    const [filteredTokens, setFilteredTokens] = useState<Token[]>(tokens);
    const [displayedTokensCount, setDisplayedTokensCount] =
        useState(ITEMS_PER_PAGE);
    const [searchError, setSearchError] = useState<string | null>(null);

    useEffect(() => {
        setSearchQuery(search);
        setTokens(tokens);
    }, [search, tokens, setSearchQuery, setTokens]);

    const debounceSearch = useCallback(
        debounce(value => {
            setSearchQuery(value);
            const newFilteredTokens = tokens.filter(token =>
                token.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTokens(newFilteredTokens);
            setDisplayedTokensCount(ITEMS_PER_PAGE);
            if (newFilteredTokens.length === 0) {
                setSearchError('No tokens match your search.');
            } else {
                setSearchError(null);
            }
        }, 500),
        [tokens, setSearchQuery]
    );

    useEffect(() => {
        debounceSearch(search);
    }, [search, debounceSearch]);

    const handleLoadMore = () => {
        setDisplayedTokensCount(prev => prev + ITEMS_PER_PAGE);
    };

    const sortedTokens = [
        ...favoriteTokens,
        ...filteredTokens.filter(
            token => !favoriteTokens.some(fav => fav.address === token.address)
        )
    ];

    const displayedSortedTokens = sortedTokens.slice(0, displayedTokensCount);

    const rowRenderer = ({
        index,
        key,
        style
    }: {
        index: number;
        key: string;
        style: React.CSSProperties;
    }) => {
        const token = displayedSortedTokens[index];
        const isFavorite = favoriteTokens.some(
            t => t.address === token.address
        );
        return (
            <Link
                href={`/token/${token.chainId}/${token.address}`}
                key={key}
                style={style}
                className={`${styles.tokenRow} ${isFavorite ? styles.favorite : ''}`}
            >
                <div>
                    <Image
                        src={token.logoURI || defaultLogo}
                        alt={token.name}
                        width="20"
                        height="20"
                    />
                    <p className={styles.name}>{token.name}</p>
                    <p>{token.address}</p>
                </div>
                {isFavorite && (
                    <Image
                        src={favoriteIcon}
                        alt="Favorite"
                        width="20"
                        height="20"
                        className={styles.favoriteIcon}
                    />
                )}
            </Link>
        );
    };

    return (
        <div className={styles.container}>
            <h1>Token Overview</h1>
            <input
                type="text"
                placeholder="Search tokens"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
            />
            {error && <div>{error}</div>}
            {searchError && <div>{searchError}</div>}
            <AutoSizer disableHeight>
                {({width}) => (
                    <List
                        width={width}
                        height={1000}
                        rowCount={displayedSortedTokens.length}
                        rowHeight={50}
                        rowRenderer={rowRenderer}
                        overscanRowCount={5}
                    />
                )}
            </AutoSizer>
            {displayedTokensCount < filteredTokens.length && (
                <button
                    onClick={handleLoadMore}
                    className={styles.loadMoreButton}
                >
                    Load More
                </button>
            )}
        </div>
    );
}

function debounce(func: (...args: any) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
