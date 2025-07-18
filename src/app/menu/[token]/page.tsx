'use client';

import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Utensils, GlassWater, QrCode, Timer } from 'lucide-react';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from "firebase/firestore"; 

const menuData = {
  "Coffees & Hot Drinks": [
    { name: "Espresso", description: "A classic single shot of intense coffee.", price: "3.00" },
    { name: "Americano", description: "Espresso shots topped with hot water.", price: "3.50" },
    { name: "Latte", description: "Rich espresso with steamed milk and a light layer of foam.", price: "4.50" },
    { name: "Cappuccino", description: "A perfect balance of espresso, steamed milk, and foam.", price: "4.50" },
    { name: "Chai Latte", description: "Black tea infused with spices, steamed milk, and a hint of sweetness.", price: "4.50" },
  ],
  "Pastries & Sweets": [
    { name: "Butter Croissant", description: "Flaky, buttery, and freshly baked.", price: "3.50" },
    { name: "Chocolate Croissant", description: "A classic croissant with a rich dark chocolate filling.", price: "4.00" },
    { name: "Almond Croissant", description: "Filled and topped with almond cream and sliced almonds.", price: "4.50" },
    { name: "Blueberry Muffin", description: "A soft muffin bursting with fresh blueberries.", price: "3.00" },
  ],
  "Cold Beverages": [
    { name: "Iced Coffee", description: "Our signature blend, chilled and served over ice.", price: "4.00" },
    { name: "Fresh Orange Juice", description: "Squeezed daily from fresh oranges.", price: "5.00" },
    { name: "Sparkling Water", description: "Crisp and refreshing.", price: "2.50" },
  ],
};

const menuIcons: { [key: string]: React.ReactNode } = {
  "Coffees & Hot Drinks": <Coffee className="w-6 h-6 mr-3 text-primary" />,
  "Pastries & Sweets": <Utensils className="w-6 h-6 mr-3 text-primary" />,
  "Cold Beverages": <GlassWater className="w-6 h-6 mr-3 text-primary" />,
};

function InvalidSessionModal({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-500">
      <Card className="w-11/12 max-w-sm p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-4">
          <QrCode className="w-16 h-16 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold font-headline mb-2">Oturum Geçersiz</h2>
        <p className="text-muted-foreground">
          {message}
        </p>
      </Card>
    </div>
  );
}

function MenuPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setErrorMessage("Menüye erişmek için lütfen masanızdaki QR kodunu okutun.");
        setIsValid(false);
        return;
      }

      // Check if token is already used in Firestore
      const tokenRef = doc(db, "expired_tokens", token);
      const tokenSnap = await getDoc(tokenRef);

      if (tokenSnap.exists()) {
        setErrorMessage("Bu menü linki daha önce kullanılmış. Lütfen QR kodu tekrar okutun.");
        setIsValid(false);
        return;
      }

      // Check JWT validity
      try {
        const decoded = jwt.decode(token) as JwtPayload;
        if (decoded && decoded.exp) {
          const expirationTime = decoded.exp * 1000;
          const now = Date.now();
          const isExpired = now >= expirationTime;

          if (isExpired) {
             setErrorMessage("Oturum süreniz doldu. Lütfen QR kodu yeniden okutun.");
             setIsValid(false);
          } else {
            // Token is valid and not used, show menu and then expire it
            setIsValid(true);
            setRemainingTime(Math.round((expirationTime - now) / 1000));
            // Add token to expired list in Firestore so it can't be reused
            await setDoc(tokenRef, { expiredAt: new Date() });
          }
        } else {
          setErrorMessage("Geçersiz menü linki. Lütfen QR kodu tekrar okutun.");
          setIsValid(false);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setErrorMessage("Geçersiz bir hata oluştu. Lütfen QR kodu tekrar okutun.");
        setIsValid(false);
      }
    }

    validateToken();
  }, [token]);

  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0) {
      if (remainingTime === 0) {
        setIsValid(false);
        setErrorMessage("Oturum süreniz doldu. Lütfen QR kodu yeniden okutun.");
      }
      return;
    };

    const timer = setInterval(() => {
      setRemainingTime(prev => (prev !== null ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);


  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Coffee className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!isValid) {
    return <InvalidSessionModal message={errorMessage} />;
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold font-headline text-primary/90">Menümüz</h1>
          <p className="text-muted-foreground mt-2 text-lg">Sizin için taptaze hazırlandı</p>
          {remainingTime !== null && (
            <Card className="max-w-xs mx-auto mt-4 py-2 px-4 bg-secondary border-primary/20">
              <div className="flex items-center justify-center space-x-2 text-secondary-foreground">
                <Timer className="w-5 h-5" />
                <p className="font-mono text-lg font-semibold">
                  Kalan Süre: {String(Math.floor(remainingTime / 60)).padStart(2, '0')}:{String(remainingTime % 60).padStart(2, '0')}
                </p>
              </div>
            </Card>
          )}
        </header>

        <Accordion type="multiple" defaultValue={Object.keys(menuData)} className="w-full max-w-2xl mx-auto">
          {Object.entries(menuData).map(([category, items]) => (
            <AccordionItem value={category} key={category} className="border-b-2 border-primary/10">
              <AccordionTrigger className="text-2xl font-headline hover:no-underline">
                <div className="flex items-center">
                  {menuIcons[category]}
                  <span>{category}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid gap-4">
                  {items.map((item) => (
                    <Card key={item.name} className="flex justify-between items-center p-4 shadow-sm transition-shadow hover:shadow-md">
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <p className="font-bold text-lg text-primary">${item.price}</p>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </>
  );
}

export default MenuPage;
