/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    }
  },
  async redirects() {
    return [
      {
        source: "/v2",
        destination: "/diagnostico",
        permanent: false
      },
      {
        source: "/v2/:path*",
        destination: "/diagnostico",
        permanent: false
      },
      {
        source: "/app",
        destination: "/diagnostico",
        permanent: false
      },
      {
        source: "/app/:path*",
        destination: "/diagnostico",
        permanent: false
      },
      {
        source: "/demo",
        destination: "/diagnostico",
        permanent: false
      }
    ];
  }
};

export default nextConfig;
