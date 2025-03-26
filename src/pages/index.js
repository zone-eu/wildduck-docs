import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import MyMarkdown from './main-page.md';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();

    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    <img src="img/favicon.ico" style={{ height: '2.75rem', width: 'auto', marginRight: '1rem', paddingTop: '0.5rem' }} />
                    {siteConfig.title}
                </Heading>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link className="button button--secondary button--lg" to="/docs/intro">
                        Wildduck Email Server - Intro
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout title={`${siteConfig.title}`} description="WildDuck is a scalable no-SPOF IMAP/POP3 mail server">
            <HomepageHeader />
            <main>
                <HomepageFeatures />
                <div className="container">
                    <div className="row">
                        <div className={clsx('col col--9 mt-2 margin-vert--lg', styles['index-markdown'])}>
                            <MDXContent>
                                <MyMarkdown />
                            </MDXContent>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
