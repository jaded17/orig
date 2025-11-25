
// src/environments/environment.prod.ts
export const environmentProd = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
  apiTimeout: 30000,
  maxFileSize: 5 * 1024 * 1024,
  allowedFileTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
};