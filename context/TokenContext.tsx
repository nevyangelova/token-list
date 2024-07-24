'use client';

import {createContext, useContext, useState, ReactNode, useEffect} from 'react';

type Token = {
    name: string;
    address: string;
    logoURI: string;
    chainId: string;
    symbol: string;
    decimals: number;
    coinKey: string;
    priceUSD: string;
};

type TokenContextType = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    tokens: Token[];
    setTokens: (tokens: Token[]) => void;
    favoriteTokens: Token[];
    toggleFavorite: (token: Token) => void;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({children}: {children: ReactNode}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [tokens, setTokens] = useState<Token[]>([]);
    const [favoriteTokens, setFavoriteTokens] = useState<Token[]>(() => {
        if (typeof window !== 'undefined') {
            const savedFavorites = localStorage.getItem('favoriteTokens');
            return savedFavorites ? JSON.parse(savedFavorites) : [];
        }
        return [];
    });

    const toggleFavorite = (token: Token) => {
        setFavoriteTokens(prev => {
            const isFavorite = prev.find(t => t.address === token.address);
            const updatedFavorites = isFavorite
                ? prev.filter(t => t.address !== token.address)
                : [...prev, token];
            localStorage.setItem(
                'favoriteTokens',
                JSON.stringify(updatedFavorites)
            );
            return updatedFavorites;
        });
    };

    return (
        <TokenContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                tokens,
                setTokens,
                favoriteTokens,
                toggleFavorite
            }}
        >
            {children}
        </TokenContext.Provider>
    );
};

export const useTokenContext = () => {
    const context = useContext(TokenContext);
    if (context === undefined) {
        throw new Error('No TokenProvider');
    }
    return context;
};
