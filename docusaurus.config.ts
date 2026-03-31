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
            docId: "getting-started/introduction",
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
                label: "Introduction",
                to: "/docs/getting-started/introduction",
              },
              {
                label: "Architecture",
                to: "/docs/architecture/overview",
              },
              {
                label: "HTTP API",
                to: "/docs/category/http-api",
              },
              {
                label: "FAQ",
                to: "/docs/getting-started/faq",
              }
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
      algolia: {
        appId: '853XRKQSZS',
        apiKey: '52410ab8eb20ba296c2e8f8995a3398f',
        indexName: 'WildDuck docs',
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
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          { from: "/docs/intro", to: "/docs/getting-started/introduction" },
          { from: "/docs/general/features", to: "/docs/getting-started/features" },
          { from: "/docs/general/install", to: "/docs/getting-started/installation" },
          { from: "/docs/general/faq", to: "/docs/getting-started/faq" },
          { from: "/docs/general/migration-guide", to: "/docs/ecosystem/migration-guide" },
          { from: "/docs/api-general/api-error-codes", to: "/docs/api/error-codes" },
          { from: "/docs/additional-software/haraka-plugin", to: "/docs/architecture/inbound-smtp" },
          { from: "/docs/additional-software/wildduck-mta", to: "/docs/architecture/outbound-smtp" },
          { from: "/docs/additional-software/rspamd", to: "/docs/architecture/spam-filtering" },
          { from: "/docs/additional-software/webmail", to: "/docs/ecosystem/webmail" },
          { from: "/docs/additional-software/auditing", to: "/docs/ecosystem/auditing" },
          { from: "/docs/additional-software/import-maildir", to: "/docs/ecosystem/import-export" },
          { from: "/docs/additional-software/third-party-projects", to: "/docs/ecosystem/third-party-projects" },
          { from: "/docs/in-depth/security", to: "/docs/security/overview" },
          { from: "/docs/in-depth/roles", to: "/docs/security/access-tokens" },
          { from: "/docs/in-depth/operating-wildduck", to: "/docs/operations/operating-wildduck" },
          { from: "/docs/in-depth/docker", to: "/docs/operations/docker" },
          { from: "/docs/in-depth/acme-certificates", to: "/docs/operations/certificates" },
          { from: "/docs/in-depth/default-values", to: "/docs/operations/default-values" },
          { from: "/docs/in-depth/retention-policies", to: "/docs/operations/retention-policies" },
          { from: "/docs/in-depth/command-line", to: "/docs/operations/command-line" },
          { from: "/docs/in-depth/protocol-support", to: "/docs/concepts/protocol-support" },
          { from: "/docs/in-depth/attachment-deduplication", to: "/docs/concepts/attachment-deduplication" },
        ],
      },
    ],
  ],
  themes: ["docusaurus-theme-openapi-docs"],
};

export default async function createConfig() {
  return config;
}
