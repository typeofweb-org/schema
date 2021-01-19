module.exports = {
  title: '@typeofweb/schema',
  tagline:
    '@typeofweb/schema is a lightweight and extensible library for data validation with full TypeScript support!',
  url: 'https://www.npmjs.com/package/@typeofweb/schema',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'Type of Web',
  projectName: '@typeofweb/schema',
  themeConfig: {
    navbar: {
      title: '@typeofweb/schema',
      logo: {
        alt: '@typeofweb/schema logo',
        src: 'img/favicon.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/typeofweb/schema',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting started',
              to: 'docs/',
            },
            {
              label: 'Validators',
              to: 'docs/validators/oneof',
            },
            {
              label: 'Modifiers',
              to: 'docs/modifiers/nullable',
            },
            {
              label: 'Utilities',
              to: 'docs/utilities/pipe',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.typeofweb.com/',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/typeofweb',
            },
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/typeofweb/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/typeofweb/schema',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Type Of Web`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/typeofweb/schema/edit/main/schema/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
