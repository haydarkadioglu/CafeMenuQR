'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Coffee } from 'lucide-react';
import jwt from 'jsonwebtoken';
import { useEffect, useState } from 'react';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-super-secret-key-that-is-long';

function generateToken() {
  // In a real application, the secret should be handled securely and not exposed on the client-side.
  return jwt.sign({}, JWT_SECRET, { expiresIn: '1m' });
}

export default function QrCodePage() {
  const [qrCodeApiUrl, setQrCodeApiUrl] = useState('');

  useEffect(() => {
    // Generate URL with token on the client-side to ensure it's unique per-load.
    const token = generateToken();
    const baseUrl = window.location.origin;
    const menuUrl = `${baseUrl}/?token=${token}`;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}&qzone=1&margin=0`;
    setQrCodeApiUrl(url);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-2xl rounded-xl border-primary/20">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Coffee className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline text-primary/90">CafeMenuQR</CardTitle>
          <CardDescription className="text-lg">Lezzetli menümüzü görüntülemek için aşağıdaki kodu tarayın!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-white rounded-lg inline-block shadow-inner">
            {qrCodeApiUrl ? (
              <Image
                src={qrCodeApiUrl}
                alt="Menü için QR kodu"
                width={250}
                height={250}
                priority
                unoptimized
              />
            ) : (
               <div className="w-[250px] h-[250px] bg-gray-200 animate-pulse rounded-lg" />
            )}
          </div>
          <p className="mt-6 text-muted-foreground">
            Menü oturumu 1 dakika sonra sona erer ve yeni bir tarama gerektirir.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
