
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { setDoc, doc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Spinner } from '@/components/spinner';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: `${firstName} ${lastName}`,
        email: user.email,
        role: "owner" // First user is owner, logic can be adjusted
      });
      
      toast({ title: "تم إنشاء الحساب بنجاح!" });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

   const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create user document in Firestore if it doesn't exist
       await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        role: "owner"
      }, { merge: true });

      toast({ title: "تم تسجيل الدخول بنجاح باستخدام Google!" });
      router.push('/dashboard');
    } catch (error: any) {
       toast({
        title: "خطأ في تسجيل الدخول عبر Google",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">إنشاء حساب</CardTitle>
          <CardDescription>
            أدخل معلوماتك لإنشاء حساب جديد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">الاسم الأول</Label>
                  <Input id="first-name" placeholder="صالح" required value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">الاسم الأخير</Label>
                  <Input id="last-name" placeholder="الأحمد" required value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" dir="ltr" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner /> : 'إنشاء حساب'}
              </Button>
            </div>
          </form>
          <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin} disabled={loading}>
            {loading ? <Spinner /> : 'التسجيل باستخدام Google'}
          </Button>
          <div className="mt-4 text-center text-sm">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="underline">
              تسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
