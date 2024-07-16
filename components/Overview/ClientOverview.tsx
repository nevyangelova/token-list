'use client';

import {useState, useEffect, useCallback} from 'react';
import Link from 'next/link';
import {List, AutoSizer} from 'react-virtualized';
import {useTokenContext} from '../../context/TokenContext';
import {Token} from '@/api/token';
import styles from './style.module.scss';
import defaultLogo from '/public/placeholder.png';
import Image from 'next/image';

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
    const {setSearchQuery, setTokens} = useTokenContext();
    const [search, setSearch] = useState(initialSearchQuery);
    const [filteredTokens, setFilteredTokens] = useState<Token[]>(tokens);
    const [displayedTokens, setDisplayedTokens] = useState<Token[]>(
        tokens.slice(0, ITEMS_PER_PAGE)
    );
    const [searchError, setSearchError] = useState<string | null>(null);

    useEffect(() => {
        setSearchQuery(search);
        setTokens(tokens);
        setDisplayedTokens(tokens.slice(0, ITEMS_PER_PAGE));
    }, [search, tokens, setSearchQuery, setTokens]);

    const debounceSearch = useCallback(
        debounce(value => {
            setSearchQuery(value);
            const newFilteredTokens = tokens.filter(token =>
                token.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTokens(newFilteredTokens);
            setDisplayedTokens(newFilteredTokens.slice(0, ITEMS_PER_PAGE));
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
        setDisplayedTokens(prev => [
            ...prev,
            ...filteredTokens.slice(prev.length, prev.length + ITEMS_PER_PAGE)
        ]);
    };

    const rowRenderer = ({
        index,
        key,
        style
    }: {
        index: number;
        key: string;
        style: React.CSSProperties;
    }) => {
        const token = displayedTokens[index];
        return (
            <Link
                href={`/token/${token.chainId}/${token.address}`}
                key={key}
                style={style}
                className={styles.tokenRow}
            >
                <div>
                    <Image
                        src={token.logoURI || defaultLogo}
                        alt={token.name}
                        width="20"
                        height="20"
                    />
                    <span>
                        {token.name} - {token.address}
                    </span>
                </div>
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
            {searchError && (
                <div>{searchError}</div>
            )}
            <AutoSizer disableHeight>
                {({width}) => (
                    <List
                        width={width}
                        height={1000}
                        rowCount={displayedTokens.length}
                        rowHeight={50}
                        rowRenderer={rowRenderer}
                        overscanRowCount={5}
                    />
                )}
            </AutoSizer>
            {displayedTokens.length < filteredTokens.length && (
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
