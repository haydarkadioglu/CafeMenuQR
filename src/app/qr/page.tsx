import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Coffee } from 'lucide-react';

export default function QrCodePage() {
  const menuUrl = '/'; // In production, this should be the absolute URL e.g. https://my-cafe.com
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}&qzone=1&margin=0`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-2xl rounded-xl border-primary/20">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Coffee className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline text-primary/90">CafeMenuQR</CardTitle>
          <CardDescription className="text-lg">Scan the code below to view our delicious menu!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-white rounded-lg inline-block shadow-inner">
            <Image
              src={qrCodeApiUrl}
              alt="QR code for menu"
              width={250}
              height={250}
              priority
              unoptimized
            />
          </div>
          <p className="mt-6 text-muted-foreground">
            For a fresh experience, the menu session expires after 1 minute, requiring a new scan.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
