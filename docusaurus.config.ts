// @ts-check

import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import type * as Plugin from "@docusaurus/types/src/plugin";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

const config: Config = {
  title: "Wildduck Mail Server",
  tagline: "WildDuck is a scalable no-SPOF IMAP/POP3 mail server",
  url: "https://zone-eu.github.io",
  baseUrl: "/wildduck-docs/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "zone-eu", // Usually your GitHub org/user name.
  projectName: "wildduck-docs", // Usually your repo name.

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
            href: "https://github.com/nodemailer/wildduck",
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
                label: "Discord",
                href: "https://discord.gg/j3fWEkjM",
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
                href: "https://github.com/nodemailer/wildduck",
                label: "Wildduck GitHub"
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
            specPath: "https://raw.githubusercontent.com/nodemailer/wildduck/refs/heads/master/docs/api/openapidocs.json",
            outputDir: "docs/wildduck-api",
            downloadUrl:
              "https://raw.githubusercontent.com/nodemailer/wildduck/refs/heads/master/docs/api/openapidocs.json",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
            },
            hideSendButton: true
          } satisfies OpenApiPlugin.Options,
        } satisfies Plugin.PluginOptions,
      },
    ],
  ],

  themes: ["docusaurus-theme-openapi-docs"],
};

export default async function createConfig() {
  return config;
}
