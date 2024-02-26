/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://dipmaxtech.com",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.classistatic.de",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
       {
        protocol: "https",
        hostname: "mascus.de",
        port: "",
        pathname: "/**",
      },{
        protocol: "https",
        hostname: "st.mascus.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "machineryline.info",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
