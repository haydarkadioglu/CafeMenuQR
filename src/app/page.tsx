'use server';

import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-super-secret-key-that-is-long';

function generateToken() {
  return jwt.sign({}, JWT_SECRET, { expiresIn: '1m' });
}

export default async function HomePage() {
  const token = generateToken();
  redirect(`/menu/${token}`);
}
