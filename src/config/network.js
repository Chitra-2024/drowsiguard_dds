import Constants from 'expo-constants';
import { Platform, NativeModules } from 'react-native';

function resolveHostFromExpo() {
  const hostUri = Constants?.expoConfig?.hostUri || Constants?.manifest?.hostUri || Constants?.manifest?.debuggerHost;
  if (hostUri && typeof hostUri === 'string') {
    const host = hostUri.split(':')[0];
    if (host) return host;
  }
  return null;
}

function resolveHostFromScriptURL() {
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL && typeof scriptURL === 'string') {
      const match = scriptURL.match(/https?:\/\/(.*?):\d+/);
      if (match && match[1]) return match[1];
    }
  } catch {}
  return null;
}

export function getHost() {
  const fromExpo = resolveHostFromExpo();
  if (fromExpo) return fromExpo;
  const fromScript = resolveHostFromScriptURL();
  if (fromScript) return fromScript;
  // Fallbacks
  if (Platform.OS === 'android') return '10.0.2.2';
  return 'localhost';
}

export function buildHttpUrl(port, path = '') {
  const host = getHost();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `http://${host}:${port}${path ? normalizedPath : ''}`;
}

export function getApiBaseUrl() {
  return buildHttpUrl(5000, '/api');
}

export function getMlServerUrl() {
  return buildHttpUrl(8000);
}


