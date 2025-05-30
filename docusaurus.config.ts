// @ts-check

import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import type * as Plugin from "@docusaurus/types/src/plugin";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

const config: Config = {
  title: "Wildduck Mail Server",
  tagline: "WildDuck is a scalable no-SPOF IMAP/POP3 mail server",
  url: "https://docs.wildduck.email",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "zone-eu", // Usually your GitHub org/user name.
  projectName: "wildduck-docs", // Usually your repo name.

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
        rel: 'stylesheet',
      },
    },
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.ts"),
          docItemComponent: "@theme/ApiItem", // Derived from docusaurus-theme-openapi
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        //   onInlineAuthors: "ignore",
        //   onUntruncatedBlogPosts: "ignore",
        // },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig:
    {
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        title: "Wildduck Mail Server",
        logo: {
          alt: "Wildduck Mail Server logo",
          src: "img/duck.png",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Documentation",
          },
          // { to: "/blog", label: "Blog", position: "left" },
          {
            label: "Wildduck API",
            position: "left",
            to: "/docs/category/wildduck-api",
          },
          {
            href: "https://github.com/zone-eu/wildduck",
            label: "Wildduck GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "General",
                to: "/docs/intro",
              },
              {
                label: "HTTP API",
                to: "/docs/category/http-api",
              },
              {
                label: "FAQ",
                to: "/docs/general/faq",
              }
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Gitter",
                href: "https://gitter.im/nodemailer/wildduck",
              },
            ],
          },
          {
            title: "More",
            items: [
              // {
              //   label: "Blog",
              //   to: "/blog",
              // },
              {
                href: "https://github.com/zone-eu/wildduck",
                label: "Wildduck GitHub"
              },
              {
                href: "https://github.com/nodemailer/nodemailer",
                label: "Nodemailer GitHub"
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Zone Media. Built with Docusaurus.`,
      },
    } satisfies Preset.ThemeConfig,

  plugins: [
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "openapi",
        docsPluginId: "classic",
        config: {
          "wildduck-api": {
            specPath: "https://raw.githubusercontent.com/zone-eu/wildduck/refs/heads/master/docs/api/openapidocs.json",
            outputDir: "docs/wildduck-api",
            downloadUrl:
              "https://raw.githubusercontent.com/zone-eu/wildduck/refs/heads/master/docs/api/openapidocs.json",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
            },
            hideSendButton: true
          } satisfies OpenApiPlugin.Options,
        } satisfies Plugin.PluginOptions,
      }
    ],
    require.resolve('docusaurus-lunr-search')
  ],
  themes: ["docusaurus-theme-openapi-docs"],
};

export default async function createConfig() {
  return config;
}
