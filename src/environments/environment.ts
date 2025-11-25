// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000, // 30 seconds
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
};
