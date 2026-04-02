// @ts-check
import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      collapsed: false,
      label: 'Getting Started',
      items: [
        'getting-started/introduction',
        'getting-started/features',
        'getting-started/installation',
        'getting-started/faq',
      ],
    },
    {
      type: 'category',
      collapsed: false,
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/wildduck-server',
        'architecture/inbound-smtp',
        'architecture/outbound-smtp',
        'architecture/spam-filtering',
      ],
    },
    {
      type: 'category',
      collapsed: false,
      label: 'HTTP API',
      link: {
        type: 'generated-index',
        title: 'HTTP API',
        description: 'WildDuck HTTP API documentation and guides',
      },
      items: [
        { type: 'link', label: 'Wildduck API Reference', href: '/docs/category/wildduck-api' },
        'api/error-codes',
        'api/webhooks',
        'api/event-source',
        'api/message-submission',
        'api/storage-api',
      ],
    },
    {
      type: 'category',
      collapsed: true,
      label: 'Security',
      items: [
        'security/overview',
        'security/authentication',
        'security/access-tokens',
        'security/encryption',
      ],
    },
    {
      type: 'category',
      collapsed: true,
      label: 'Operations',
      items: [
        'operations/configuration',
        'operations/operating-wildduck',
        'operations/docker',
        'operations/certificates',
        'operations/default-values',
        'operations/retention-policies',
        'operations/command-line',
      ],
    },
    {
      type: 'category',
      collapsed: true,
      label: 'Concepts',
      items: [
        'concepts/protocol-support',
        'concepts/attachment-deduplication',
        'concepts/message-filtering',
        'concepts/domain-management',
        'concepts/full-text-search',
      ],
    },
    {
      type: 'category',
      collapsed: true,
      label: 'Tools & Ecosystem',
      items: [
        'ecosystem/auditing',
        'ecosystem/webmail',
        'ecosystem/import-export',
        'ecosystem/migration-guide',
        'ecosystem/third-party-projects',
      ],
    },
  ],
  openApiSidebar: [
    {
      type: "category",
      label: "Wildduck API",
      link: {
        type: "generated-index",
        title: "Wildduck API",
        description: "This is the API documentation for Wildduck Email Server",
        slug: "/category/wildduck-api"
      },
      items: require("./docs/wildduck-api/sidebar.js")
    }
  ]
};

export default sidebars;
