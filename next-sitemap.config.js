/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://blog.frank-mayer.io",
  generateRobotsTxt: true,
  autoLastmod: true,
};
