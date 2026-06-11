/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['os', 'child_process', 'fs'],
  outputFileTracingIncludes: {
    '/api/pixlate': ['./pix', './pix.exe'],
  },
};

export default nextConfig;
