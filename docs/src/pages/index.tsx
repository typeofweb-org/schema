import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Focused on speed',
    imageUrl: 'img/fast.svg',
    description: (
      <>
        @typeofweb/schema is significantly faster compared to most other validators. We want to
        provide fast and reliable packages for people to use.
      </>
    ),
  },
  {
    title: 'Lightweight',
    imageUrl: 'img/winners.svg',
    description: (
      <>
        @typeofweb/schema is one of the most lightweight packages available. It's side-effect free
        and supports tree shaking. Bundle only what you need!
      </>
    ),
  },
  {
    title: 'Based on functional programming',
    imageUrl: 'img/functional.svg',
    description: (
      <>
        We believe that functional programming is one of the most efficient paradigms.
        @typeofweb/schema exposes sweet functional API without confusing theoretical concepts to
        learn.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={`${siteConfig.title} validation library`} description={siteConfig.tagline}>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">
            @typeofweb
            <wbr />
            /schema
          </h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
