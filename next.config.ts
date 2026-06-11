import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Enforce www as the canonical host (matches Vercel serving domain)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'talroman.com' }],
        destination: 'https://www.talroman.com/:path*',
        permanent: true,
      },

      // ── Legacy Wix URLs still indexed by Google / linked externally ──
      // Hebrew paths must be percent-encoded — Next matches the encoded URL.
      // סדנאות
      { source: '/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA', destination: '/courses', permanent: true },
      // products/סדנת-טנטרה-פרטית-לזוגות
      { source: '/products/%D7%A1%D7%93%D7%A0%D7%AA-%D7%98%D7%A0%D7%98%D7%A8%D7%94-%D7%A4%D7%A8%D7%98%D7%99%D7%AA-%D7%9C%D7%96%D7%95%D7%92%D7%95%D7%AA', destination: '/courses/personal-tantra', permanent: true },
      // products/תהליך-ליווי-אישי-נשי
      { source: '/products/%D7%AA%D7%94%D7%9C%D7%99%D7%9A-%D7%9C%D7%99%D7%95%D7%95%D7%99-%D7%90%D7%99%D7%A9%D7%99-%D7%A0%D7%A9%D7%99', destination: '/personal-coaching', permanent: true },
      { source: '/products/talk-me-into-it', destination: '/courses/talk-me-into-it', permanent: true },
      { source: '/products/:path*', destination: '/courses', permanent: true },

      // Old Wix gift landing pages → current gifts
      // gifts/תשוקה-מתפרצת
      { source: '/gifts/%D7%AA%D7%A9%D7%95%D7%A7%D7%94-%D7%9E%D7%AA%D7%A4%D7%A8%D7%A6%D7%AA', destination: '/gifts/bring-back', permanent: true },
      // gifts/אני-רוצה-להחזיר-את-המיניותשלנו
      { source: '/gifts/%D7%90%D7%A0%D7%99-%D7%A8%D7%95%D7%A6%D7%94-%D7%9C%D7%94%D7%97%D7%96%D7%99%D7%A8-%D7%90%D7%AA-%D7%94%D7%9E%D7%99%D7%A0%D7%99%D7%95%D7%AA%D7%A9%D7%9C%D7%A0%D7%95', destination: '/gifts/bring-back', permanent: true },
      // gifts/אני-רוצה-להעמיק-במיניות-שלנו
      { source: '/gifts/%D7%90%D7%A0%D7%99-%D7%A8%D7%95%D7%A6%D7%94-%D7%9C%D7%94%D7%A2%D7%9E%D7%99%D7%A7-%D7%91%D7%9E%D7%99%D7%A0%D7%99%D7%95%D7%AA-%D7%A9%D7%9C%D7%A0%D7%95', destination: '/gifts/go-deeper', permanent: true },
      // gifts/אורגזמה-בלי-מאמץ
      { source: '/gifts/%D7%90%D7%95%D7%A8%D7%92%D7%96%D7%9E%D7%94-%D7%91%D7%9C%D7%99-%D7%9E%D7%90%D7%9E%D7%A5', destination: '/gifts/go-deeper', permanent: true },
      // gifts/מיניות-מהסרטים-החדשים
      { source: '/gifts/%D7%9E%D7%99%D7%A0%D7%99%D7%95%D7%AA-%D7%9E%D7%94%D7%A1%D7%A8%D7%98%D7%99%D7%9D-%D7%94%D7%97%D7%93%D7%A9%D7%99%D7%9D', destination: '/gifts/go-deeper', permanent: true },
      { source: '/mtnvt-1/:path*', destination: '/gifts/bring-back', permanent: true },

      // Old Wix blog / misc pages
      { source: '/post/:path*', destination: '/articles', permanent: true },
      { source: '/blog', destination: '/articles', permanent: true },
      { source: '/articles/men/:slug', destination: '/articles/:slug', permanent: true },
      { source: '/facebookgroups', destination: '/communities', permanent: true },
      { source: '/gallery', destination: '/media', permanent: true },
      { source: '/videos', destination: '/media', permanent: true },
      { source: '/recommendation', destination: '/recommendations', permanent: true },
      { source: '/generate-page/:path*', destination: '/', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
