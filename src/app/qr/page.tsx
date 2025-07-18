'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Coffee } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function QrCodePage() {
  const [qrCodeApiUrl, setQrCodeApiUrl] = useState('');

  useEffect(() => {
    // QR kodun her zaman uygulamanın ana sayfasına yönlendirmesini sağlıyoruz.
    const baseUrl = window.location.origin;
    const menuUrl = `${baseUrl}/`; // QR kod her zaman ana sayfaya (/) yönlendirir.
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}&qzone=1&margin=0`;
    setQrCodeApiUrl(url);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-2xl rounded-xl border-primary/20 bg-card">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Coffee className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline text-primary/90">CafeMenuQR</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Lezzetli menümüzü görüntülemek için aşağıdaki kodu tarayın!</CardDescription>
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
             QR kodu okutarak her seferinde 1 dakika geçerli yeni bir menü oturumu başlatın.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
