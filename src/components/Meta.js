import Head from 'next/head'
import PropTypes from 'prop-types'

export function Meta() {
  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/favicon/safari-pinned-tab.svg"
        color="#000000"
      />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
    </Head>
  )
}

export function PageMeta({ title, description }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content="https://popstore-eds.vercel.app/_next/image?url=https%3A%2F%2Fimgix.cosmicjs.com%2F9ca3b5e0-943b-11ee-b62d-5b90a0a1bade-logo-marche-eds-noel-removebg.png&w=256&q=75"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@CosmicJS" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content="https://popstore-eds.vercel.app/_next/image?url=https%3A%2F%2Fimgix.cosmicjs.com%2F9ca3b5e0-943b-11ee-b62d-5b90a0a1bade-logo-marche-eds-noel-removebg.png&w=256&q=75"
      />
    </Head>
  )
}

PageMeta.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}
