/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
     remotePatterns: [
        {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'ui-avatars.com',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: "nextjs-chatter-teal.vercel.app",
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'http',
            hostname: 'localhost',
            port: '3000',
            pathname: '/api/images/**',
        },
     ]
    },
}

export default nextConfig;
