'use client';

import {createContext, useContext, useState, ReactNode} from 'react';

type Token = {
    name: string;
    address: string;
    logoURI: string;
};

type TokenContextType = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    tokens: Token[];
    setTokens: (tokens: Token[]) => void;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({children}: {children: ReactNode}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [tokens, setTokens] = useState<Token[]>([]);

    return (
        <TokenContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                currentPage,
                setCurrentPage,
                tokens,
                setTokens,
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
