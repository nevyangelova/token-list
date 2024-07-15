/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'static.debank.com',
            },
            {
                protocol: 'https',
                hostname: 'assets.coingecko.com',
            },
            {
                protocol: 'https',
                hostname: 's2.coinmarketcap.com',
            },
            {
                protocol: 'https',
                hostname: 'static.debank.com',
            },
            {
                protocol: 'https',
                hostname: 'static.debank.com',
            },
        ],
    },
};

export default nextConfig;
