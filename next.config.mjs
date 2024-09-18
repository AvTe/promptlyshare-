/** @type {import('next').NextConfig} */
const nextConfig = {
    // experimental: {
      // appDir: true,
      // serverComponentsExternalPackages: ["mongoose"],
    // },
    experimental: {
      // This option allows you to opt-out of Server Components for pages that use `getServerSideProps` or `getInitialProps`
      appDir: true,
      // This option allows you to opt-out of Server Components for pages that use `getServerSideProps` or `getInitialProps`
      // and instead render them as Static Site Generation (SSG) pages.
      // serverComponentsExternalPackages: ["mongoose"],
    },
    images: {
      domains: ['lh3.googleusercontent.com'],
    },
    webpack(config) {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      }
      return config
    }
  }
  
  export default nextConfig
