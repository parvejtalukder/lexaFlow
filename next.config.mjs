/** @type {import('next').NextType} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/upload',
        destination: 'http://72.61.17.107/api/upload', 
      },
      {
        source: '/uploads/:path*',
        destination: 'http://72.61.17.107/uploads/:path*', 
      },
    ];
  },
};

export default nextConfig;