let API_URL;

if (import.meta.env.DEV) {
  // Development environment
  API_URL = import.meta.env.VITE_API_URL;
} else {
  // Production environment
  API_URL = `https://${window.location.hostname}:${window.location.port}`;
}

export default API_URL;
