/* jest-dom adds custom jest matchers for asserting on DOM nodes.
   allows you to do things like:
   expect(element).toHaveTextContent(/react/i)
   learn more: https://github.com/testing-library/jest-dom */
import '@testing-library/jest-dom';

// Provide a default fetch mock; individual tests can override as needed.
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({}),
    })
  );
}

// JSDOM polyfill for matchMedia if a component/page uses it.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = function matchMedia(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated
      removeListener: () => {}, // deprecated
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
}
