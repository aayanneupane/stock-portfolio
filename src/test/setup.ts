import '@testing-library/jest-dom/vitest';

// Highcharts (and some MUI internals) rely on browser APIs not fully provided by jsdom.
if (!('CSS' in window)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).CSS = {};
}
if (typeof window.CSS.supports !== 'function') {
  window.CSS.supports = () => false;
}

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

