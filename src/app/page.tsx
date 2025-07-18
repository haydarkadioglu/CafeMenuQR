'use server';

import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-super-secret-key-that-is-long';

async function generateToken() {
  // Her token'ın kesinlikle benzersiz olmasını sağlamak için rastgele bir değer ekliyoruz.
  const payload = {
    iat: Math.floor(Date.now() / 1000), // Saniye cinsinden oluşturulma zamanı
    salt: Math.random(), // Benzersizliği garantilemek için rastgele sayı
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1m' }); // 1 dakika geçerli
}

export default async function HomePage() {
  const token = await generateToken();
  redirect(`/menu/${token}`);
}
