import Head from 'next/head';
import Image from 'next/image';
import Header from './Header';

export default function Layout({ children, theme }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png" />
        <link rel="manifest" href="favicons/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <title>Has Kanye Dropped?</title>
        <style>{`
          @font-face {
            font-family: VCR;
            src: url(/fonts/FugazOne-Regular.ttf);
          }
          .hover-link {
            color: black;
            cursor: pointer;
          }
          .hover-link:hover {
            color: black;
            opacity: 0.5;
          }
        `}</style>
      </Head>

      <div className='flex-container px-4' style={{ fontFamily: 'VCR, sans-serif' }}>
        <Header theme={theme} />
        {children}
        <div className='fluid-container d-flex justify-content-center pb-4'>
          <a className='d-flex align-items-center hover-link' href='https://theivyplatform.com'>
            <div className='bold'>An Ivy Joint</div>
            <Image
              src='/images/ivy_logo.png'
              width={18}
              height={18}
              alt="Ivy Logo"
              className='ml-2'
            />
          </a>
        </div>
      </div>
    </>
  );
} 