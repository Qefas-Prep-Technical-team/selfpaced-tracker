// lib/api-config.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const API_ENDPOINTS = {
  CHANNELS: `${BASE_URL}/channels`,
  USERS: `${BASE_URL}/users`,
};