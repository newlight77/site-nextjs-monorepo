import '../styles/globals.css'
import './styles.css';
import './home.css';

import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Script from 'next/script';
import Header from '../components/header/header.component';
import { GA_TRACKING_ID, trackPageView } from '../utils/gtag';
import Footer from '../components/footer/footer.component';

const App = ({ Component, pageProps }) => {
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

      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
};

export default App;