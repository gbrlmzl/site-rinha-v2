/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://rinhacampusiv.org',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/perfil',
    '/perfil/*',
    '/admin',
    '/admin/*',
    '/login',
    '/cadastro',
    '/ativacao-de-conta',
    '/ativacao-de-conta/*',
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: '*',
        disallow: ['/admin', '/perfil', '/api'],
      },
    ],
  },
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/lol': 0.9,
      '/cs': 0.9,
      '/valorant': 0.9,
      '/noticias': 0.8,
      '/sobre': 0.7,
    };

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorities[path] ?? config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
