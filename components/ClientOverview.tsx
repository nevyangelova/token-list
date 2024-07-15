'use client';

import {useState, useEffect, useCallback} from 'react';
import Link from 'next/link';
import {List, AutoSizer} from 'react-virtualized';
import {useTokenContext} from '../context/TokenContext';
import {Token} from '@/api/token';

type ClientOverviewProps = {
    tokens: Token[];
    initialSearchQuery: string;
};

const ITEMS_PER_PAGE = 20;

export default function ClientOverview({
    tokens,
    initialSearchQuery,
}: ClientOverviewProps) {
    const {setSearchQuery, setCurrentPage, setTokens} = useTokenContext();
    const [search, setSearch] = useState(initialSearchQuery);
    const [filteredTokens, setFilteredTokens] = useState<Token[]>(tokens);
    const [displayedTokens, setDisplayedTokens] = useState<Token[]>(
        tokens.slice(0, ITEMS_PER_PAGE)
    );

    useEffect(() => {
        setSearchQuery(search);
        setCurrentPage(1);
        setTokens(tokens);
    }, [search, tokens, setSearchQuery, setCurrentPage, setTokens]);

    const debounceSearch = useCallback(
        debounce((value) => {
            setSearchQuery(value);
            const newFilteredTokens = tokens.filter((token) =>
                token.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTokens(newFilteredTokens);
            setDisplayedTokens(newFilteredTokens.slice(0, ITEMS_PER_PAGE));
        }, 500),
        [tokens]
    );

    useEffect(() => {
        debounceSearch(search);
    }, [search, debounceSearch]);

    const handleLoadMore = () => {
        setDisplayedTokens((prev) => [
            ...prev,
            ...filteredTokens.slice(prev.length, prev.length + ITEMS_PER_PAGE),
        ]);
    };

    const rowRenderer = ({
        index,
        key,
        style,
    }: {
        index: number;
        key: string;
        style: React.CSSProperties;
    }) => {
        const token = displayedTokens[index];
        return (
            <div key={key} style={style}>
                <img
                    src={token.logoURI}
                    alt={token.name}
                    width='20'
                    height='20'
                />
                <Link href={`/token/${token.chainId}/${token.address}`}>
                    {token.name} + {token.address}
                </Link>
            </div>
        );
    };

    return (
        <div>
            <h1>Token Overview</h1>
            <input
                type='text'
                placeholder='Search tokens'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
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
                <button onClick={handleLoadMore}>Load More</button>
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
