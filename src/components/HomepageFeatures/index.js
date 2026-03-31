import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

const FeatureList = [
    {
        title: 'Scalable',
        image: '/img/sprites/presenting_server.png',
        description: 'Everything is stored in MongoDB with sharding support. All instances are stateless \u2014 add more behind a load balancer to increase throughput.',
    },
    {
        title: 'Full IMAP Support',
        image: '/img/sprites/juggling_mail.png',
        description: 'First-class IMAP4rev1 with IDLE, CONDSTORE, COMPRESS, SPECIAL-USE, UTF8, QUOTA, and more. Any email client should work out of the box.',
    },
    {
        title: 'Unicode Native',
        image: '/img/sprites/holding_at_sign.png',
        description: 'Full support for internationalized email addresses, folder names, and headers. \u0430\u043D\u0434\u0440\u0438\u0441@\u0443\u0430\u0439\u043B\u0434\u0434\u0430\u043A.\u043E\u0440\u0433 is a valid address.',
    },
    {
        title: 'API Controlled',
        image: '/img/sprites/using_tablet.png',
        description: 'Manage everything via REST API \u2014 accounts, mailboxes, messages, filters, auto-replies, DKIM, and more. No config file editing needed.',
    },
    {
        title: 'Secure by Design',
        image: '/img/sprites/inspecting_email.png',
        description: 'No root privileges, no filesystem access, no shell commands. Includes 2FA (TOTP + WebAuthn), application passwords, PGP encryption, and audit logs.',
    },
    {
        title: 'No Single Point of Failure',
        image: '/img/sprites/syncing_server.png',
        description: 'Every component can be replicated. MongoDB replica sets, Redis Sentinel, and multiple stateless app servers eliminate single points of failure.',
    },
];

const QuickLinks = [
    {
        label: 'Get Started',
        to: '/docs/getting-started/introduction',
        description: 'Introduction and overview',
    },
    {
        label: 'Architecture',
        to: '/docs/architecture/overview',
        description: 'How the mail suite fits together',
    },
    {
        label: 'Installation',
        to: '/docs/getting-started/installation',
        description: 'Scripted install, Docker, or manual',
    },
    {
        label: 'API Reference',
        to: '/docs/category/wildduck-api',
        description: 'Full HTTP API documentation',
    },
    {
        label: 'Source Code',
        href: 'https://github.com/zone-eu/wildduck',
        description: 'WildDuck on GitHub',
    },
    {
        label: 'Docker',
        href: 'https://github.com/nodemailer/wildduck-dockerized',
        description: 'Docker Compose setup',
    },
];

function Feature({ title, image, description }) {
    return (
        <div className={clsx('col col--4')}>
            <div className={clsx('padding--md', styles.featureCard)}>
                <div className={styles.featureImageWrapper}>
                    <img src={image} alt={title} className={styles.featureImage} loading="lazy" />
                </div>
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

function QuickLink({ label, to, href, description }) {
    const LinkComponent = to ? Link : 'a';
    const linkProps = to ? { to } : { href, target: '_blank', rel: 'noopener noreferrer' };

    return (
        <div className="col col--4">
            <LinkComponent {...linkProps} className={styles.quickLink}>
                <div className={styles.quickLinkInner}>
                    <strong>{label}</strong>
                    <span>{description}</span>
                </div>
            </LinkComponent>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <>
            <section className={styles.callout}>
                <div className="container">
                    <div className={clsx('row')}>
                        <div className="col col--10 col--offset-1">
                            <p className={styles.calloutText}>
                                WildDuck is a modern IMAP/POP3 server built on Node.js and MongoDB. Bundle it with{' '}
                                <Link to="/docs/architecture/inbound-smtp">Haraka</Link> (inbound SMTP) and{' '}
                                <Link to="/docs/architecture/outbound-smtp">ZoneMTA</Link> (outbound SMTP) for a complete mail server.
                                Best suited for <strong>1000+ accounts</strong> that need horizontal scaling.
                                For smaller setups, consider <a href="https://mailinabox.email/">Postfix+Dovecot</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className="container">
                    <div className="row">
                        {FeatureList.map((props, idx) => (
                            <Feature key={idx} {...props} />
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.quickLinks}>
                <div className="container">
                    <Heading as="h2" className={styles.sectionTitle}>Quick Links</Heading>
                    <div className="row">
                        {QuickLinks.map((props, idx) => (
                            <QuickLink key={idx} {...props} />
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.demo}>
                <div className="container">
                    <div className={clsx('row')}>
                        <div className="col col--10 col--offset-1 text--center">
                            <Heading as="h2" className={styles.sectionTitle}>Try It Out</Heading>
                            <img src="/img/sprites/writing_email.png" alt="Try WildDuck" className={styles.demoImage} loading="lazy" />
                            <p>
                                <a href="https://webmail.wildduck.email/">webmail.wildduck.email</a> is a live demo.
                                Register a free <strong>@wildduck.email</strong> address and test with the web client or your own IMAP app.
                            </p>
                            <p className={styles.smallNote}>
                                Outbound delivery from wildduck.email is disabled to prevent spam abuse.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.contact}>
                <div className="container text--center">
                    <p>
                        Licensed under <a href="https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12">EUPL 1.2</a>
                        {' '}&middot;{' '}
                        <a href="mailto:andris@wildduck.email">andris@wildduck.email</a>
                    </p>
                </div>
            </section>
        </>
    );
}
