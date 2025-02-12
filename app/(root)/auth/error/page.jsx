'use client';

import Head from 'next/head';

export default function ErrorPage({ cause }) {
  return (
    <div>
      <Head>
        <title>Error</title>
        <meta name="description" content="Error page for Next.js app" />
      </Head>
      <h1 className='pt-30'>Error</h1>
      <p>{cause}</p>

    </div>
  );
}
