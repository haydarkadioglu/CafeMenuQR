'use server';

import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-super-secret-key-that-is-long';

function generateToken() {
  // Add a unique payload to ensure the token is different every time.
  const payload = {
    iat: Math.floor(Date.now() / 1000), // Issued at time (seconds)
    salt: Math.random(), // A random value to ensure uniqueness
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1m' });
}

export default async function HomePage() {
  const token = generateToken();
  redirect(`/menu/${token}`);
}
