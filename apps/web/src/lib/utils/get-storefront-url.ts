export function getStorefrontBaseURL() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  if (process.env.VERCEL_ENV === 'production') {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return !process.env.VERCEL_BRANCH_URL
    ? 'http://localhost:3000'
    : `https://${process.env.VERCEL_BRANCH_URL}`;
}
