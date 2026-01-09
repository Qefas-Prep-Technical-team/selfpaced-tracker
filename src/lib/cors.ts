/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/cors.ts
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

// Type definitions
type Middleware = (req: NextApiRequest, res: NextApiResponse, next: (result?: any) => void) => void;

// Initialize CORS middleware
export function initMiddleware(middleware: Middleware) {
  return (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    return new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  };
}

// Configure CORS middleware
export const cors = initMiddleware(
  Cors({
    origin: [
      'http://127.0.0.1:5500',
      'http://localhost:5500',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://selfpaced-tracker.vercel.app',
      // Add your production domain
      // 'https://yourschool.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// Alternative: Allow all origins for development
export const corsAllowAll = initMiddleware(
  Cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);