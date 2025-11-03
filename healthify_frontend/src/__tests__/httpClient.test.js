import { httpClient, classifyStatus } from '../services/httpClient';
import { getEnv, reloadEnv } from '../utils/env';

function setToken(token) {
  try {
    window.localStorage.setItem('healthify_auth_token', token);
  } catch {}
}

function clearToken() {
  try {
    window.localStorage.removeItem('healthify_auth_token');
  } catch {}
}

describe('httpClient', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    clearToken();
    // default env for tests
    process.env.REACT_APP_API_BASE = 'https://api.example.com';
    reloadEnv();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('classifyStatus utility classifies codes correctly', () => {
    expect(classifyStatus(0)).toBe('network');
    expect(classifyStatus(200)).toBe('ok');
    expect(classifyStatus(401)).toBe('unauthorized');
    expect(classifyStatus(404)).toBe('not_found');
    expect(classifyStatus(501)).toBe('not_implemented');
    expect(classifyStatus(500)).toBe('server_error');
    expect(classifyStatus(400)).toBe('client_error');
  });

  test('uses base URL from env when given relative path', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ hello: 'world' }),
    });

    const res = await httpClient.get('/ping');

    expect(res.ok).toBe(true);
    // Inspect the first call to fetch, ensuring URL was joined
    const calledUrl = global.fetch.mock.calls[0][0];
    expect(calledUrl).toBe('https://api.example.com/ping');
  });

  test('injects Authorization header when token exists', async () => {
    setToken('my-jwt');

    let receivedHeaders;
    global.fetch = jest.fn().mockImplementation((_, init) => {
      receivedHeaders = init.headers;
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ ok: true }),
      });
    });

    await httpClient.get('/secure');

    // Headers may be a Headers instance; normalize for assertions
    const authHeader =
      receivedHeaders instanceof Headers
        ? receivedHeaders.get('Authorization')
        : receivedHeaders['Authorization'] || receivedHeaders['authorization'];
    expect(authHeader).toBe('Bearer my-jwt');
  });

  test('handles 401 by clearing token and attempting redirect to /login', async () => {
    setToken('expired-token');

    const replaceSpy = jest.fn();
    // Mock window.location.replace without changing jsdom URL state too much
    delete window.location;
    window.location = {
      pathname: '/dashboard',
      search: '',
      replace: replaceSpy,
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Unauthorized' }),
    });

    const res = await httpClient.get('/me', { retry: 0 });
    expect(res.ok).toBe(false);
    expect(res.status).toBe(401);

    // token should be cleared
    expect(window.localStorage.getItem('healthify_auth_token')).toBeNull();

    // should attempt redirect to login
    expect(replaceSpy).toHaveBeenCalledTimes(1);
    const redirectUrl = replaceSpy.mock.calls[0][0];
    expect(redirectUrl).toMatch(/^\/login\?from=/);
    expect(decodeURIComponent(redirectUrl.split('=')[1])).toBe('/dashboard');
  });

  test('retries on network failure (TypeError) then succeeds', async () => {
    const fetchMock = jest.fn()
      .mockRejectedValueOnce(new TypeError('Network down'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ data: 'ok' }),
      });
    global.fetch = fetchMock;

    const start = Date.now();
    const res = await httpClient.get('/retry-test', { retry: 1, retryDelayMs: 10 });
    const elapsed = Date.now() - start;

    expect(res.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    // Ensure some delay occurred (best-effort, avoid strict timing flakiness)
    expect(elapsed).toBeGreaterThanOrEqual(8);
  });

  test('does not retry on non-network error and returns formatted error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Missing' }),
    });

    const res = await httpClient.get('/missing', { retry: 2 });
    expect(res.ok).toBe(false);
    expect(res.status).toBe(404);
    expect(res.message).toMatch(/Missing|Not Found/);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('accepts absolute URLs without prefixing', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ ok: true }),
    });

    const res = await httpClient.get('https://other.example.com/echo');
    expect(res.ok).toBe(true);
    expect(global.fetch.mock.calls[0][0]).toBe('https://other.example.com/echo');
  });
});
