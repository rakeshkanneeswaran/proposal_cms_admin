/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        esmExternals: 'loose',
        serverComponentsExternalPackages: ["pdfkit"]
    }
};

export default nextConfig;
