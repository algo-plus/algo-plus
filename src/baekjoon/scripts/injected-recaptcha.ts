export {};

declare global {
  interface Window {
    grecaptcha: any;
  }
}

(function () {
  const getSiteKeyFromIframe = (): string | null => {
    const iframes = document.querySelectorAll('iframe[src*="recaptcha"]');
    for (const iframe of Array.from(iframes)) {
      const src = iframe.getAttribute('src') || '';
      const match = src.match(/[?&]k=([a-zA-Z0-9_-]+)/);
      if (match) return match[1];
    }
    return null;
  };

  const waitUntilReady = (callback: (siteKey: string) => void, tries = 0) => {
    const maxTries = 50;
    const interval = 200;

    const check = () => {
      if (window.grecaptcha?.enterprise?.execute) {
        const siteKey = getSiteKeyFromIframe();
        if (!siteKey) {
          console.error('site key 추출 실패');
          return;
        }
        callback(siteKey);
      } else if (tries >= maxTries) {
        console.error('grecaptcha 로딩 실패 (timeout)');
      } else {
        setTimeout(() => check(), interval);
      }
    };

    check();
  };

  waitUntilReady((siteKey: string) => {
    window.grecaptcha.enterprise.ready(() => {
      window.grecaptcha.enterprise
        .execute(siteKey, { action: 'submit' })
        .then((token: string) => {
          window.postMessage({ type: 'RECAPTCHA_TOKEN', token }, '*');
        })
        .catch((error: any) => {
          window.postMessage(
            {
              type: 'RECAPTCHA_ERROR',
              error: error?.message || '실패',
            },
            '*'
          );
        });
    });
  });
})();
