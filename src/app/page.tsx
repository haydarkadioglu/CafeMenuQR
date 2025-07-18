'use server';

import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/firebase';
import { doc, setDoc } from "firebase/firestore";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-super-secret-key-that-is-long';

async function generateToken() {
  // Her token'ın kesinlikle benzersiz olmasını sağlamak için rastgele bir değer ekliyoruz.
  const payload = {
    iat: Math.floor(Date.now() / 1000), // Saniye cinsinden oluşturulma zamanı
    salt: Math.random(), // Benzersizliği garantilemek için rastgele sayı
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1m' }); // 1 dakika geçerli
  
  // Token'ı hemen expired koleksiyonuna ekle
  try {
    const tokenRef = doc(db, "expired", token);
    await setDoc(tokenRef, { 
      createdAt: new Date(),
      status: 'active' // Başlangıçta aktif, kullanıldığında expired olacak
    });
  } catch (error) {
    console.error("Token Firestore'a kaydedilemedi:", error);
  }
  
  return token;
}

export default async function HomePage() {
  const token = await generateToken();
  redirect(`/menu/${token}`);
}
