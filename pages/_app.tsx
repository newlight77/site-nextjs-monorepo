import '../styles/globals.css'
import '../styles/styles.css';
import '../styles/app.css';
import '../styles/posts.css';
import '../styles/post.css';
import '../styles/markdown.css';

import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect } from 'react';
import Script from 'next/script';
import Header from '../components/header/header.component';
import { GA_TRACKING_ID, trackPageView } from '../utils/gtag';
import Footer from '../components/footer/footer.component';
import { NextPage } from 'next';
// import { ThemeProvider } from '../components/theme-dark-mode/ThemeContext';
// import ThemeToggle from '../components/theme-dark-mode/ThemeToggle';
import ThemeSelector from '../components/theme-selector/ThemeSelector';

type Page<P = object> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type Props = AppProps & {
  Component: Page;
};

const App = ({ Component, pageProps }: Props) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const isProduction = process.env.NODE_ENV.toLowerCase() === 'production';

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      {isProduction && (
        <>
          <link rel="stylesheet" href="github-markdown.css"></link>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `
            }}
          />
        </>
      )}


      <div className="app_container">
        <div className="right_header">
          {/* <ThemeProvider>
            <ThemeToggle />
          </ThemeProvider> */}
          <ThemeSelector/>
        </div>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </>
  );
};

export default App;