// Add your GA tracking id here
export const GA_TRACKING_ID = process.env.GA_TRACKING_ID || ''

const isProduction = process.env.NODE_ENV.toLowerCase() === 'production';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const trackPageView = (url: string) => {
  if (isProduction) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const trackEvent = ({ action, category, label, value }: any) => {
  if (isProduction) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};