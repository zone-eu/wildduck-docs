import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Heading from '@theme/Heading';

const FeatureList = [
    {
        title: 'Universal support',
        Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
        description: (
            <>Wildduck Mail Server is supported by all majors platforms and does not require any compiling. If the system has NodeJS - it can run Wildduck! </>
        )
    },
    {
        title: 'Ease of use',
        Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
        description: (
            <>
                Wildduck is easy to set up and use! Every setting can be configured and you can manage users, mailboxes, messages and everything else via a
                simple HTTP API!
            </>
        )
    },
    {
        title: 'Modern IMAP/POP3',
        Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
        description: <>Wildduck supports almost all modern IMAP and POP3 features, while being fast and scalable! All unicode email addresses as supported.</>
    }
];

function Feature({ Svg, title, description }) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h1">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
