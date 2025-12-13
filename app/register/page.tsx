"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, getProviders } from "next-auth/react";
import { Chrome, Facebook, Github, Linkedin, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterPage() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = translations[language];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Record<string, any> | null>(null);

  useState(() => {
    getProviders()
      .then((res) => setProviders(res || null))
      .catch(() => setProviders(null));
  });

  const enabled = {
    google: Boolean(providers?.google),
    facebook: Boolean(providers?.facebook),
    github: Boolean(providers?.github),
    linkedin: Boolean(providers?.linkedin),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Registration failed");
        return;
      }
      await signIn("credentials", { email, password, callbackUrl: "/" });
    } catch (err) {
      setError("Server error, please try again later");
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-[#1a3a52] mb-6">
            {t.createAccount}
          </h1>
          <Card className="liquid-glass border-0 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#4a6b84]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#4a6b84]" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">{t.confirmPassword}</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder={t.reenterPasswordPlaceholder}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-[#5ba3d0] hover:bg-[#4a92bf]"
              >
                {t.registerAndSignIn}
              </Button>

              <div className="flex items-center gap-2 my-2">
                <div className="h-px bg-[#dbe5ec] w-full" />
                <span className="text-xs text-[#4a6b84]">{t.or}</span>
                <div className="h-px bg-[#dbe5ec] w-full" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    enabled.google
                      ? () => signIn("google", { callbackUrl: "/" })
                      : undefined
                  }
                  disabled={!enabled.google}
                  title={enabled.google ? undefined : "Provider not configured"}
                  className="w-full"
                >
                  <Chrome className="h-4 w-4 mr-2" /> {t.signInWithGoogle}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    enabled.facebook
                      ? () => signIn("facebook", { callbackUrl: "/" })
                      : undefined
                  }
                  disabled={!enabled.facebook}
                  title={
                    enabled.facebook ? undefined : "Provider not configured"
                  }
                  className="w-full"
                >
                  <Facebook className="h-4 w-4 mr-2" /> {t.signInWithFacebook}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    enabled.github
                      ? () => signIn("github", { callbackUrl: "/" })
                      : undefined
                  }
                  disabled={!enabled.github}
                  title={enabled.github ? undefined : "Provider not configured"}
                  className="w-full"
                >
                  <Github className="h-4 w-4 mr-2" /> {t.signInWithGitHub}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    enabled.linkedin
                      ? () => signIn("linkedin", { callbackUrl: "/" })
                      : undefined
                  }
                  disabled={!enabled.linkedin}
                  title={
                    enabled.linkedin ? undefined : "Provider not configured"
                  }
                  className="w-full"
                >
                  <Linkedin className="h-4 w-4 mr-2" /> {t.signInWithLinkedIn}
                </Button>
              </div>
              {!enabled.google &&
              !enabled.facebook &&
              !enabled.github &&
              !enabled.linkedin ? (
                <p className="text-xs text-[#4a6b84] mt-2">
                  {t.providersNotConfigured}
                </p>
              ) : null}

              <div className="text-sm text-center">
                {t.alreadyHaveAccount}
                <Link
                  href="/login"
                  className="text-[#5ba3d0] hover:underline ml-1"
                >
                  {t.goToSignIn}
                </Link>
              </div>
              <div className="text-sm text-center mt-2">
                <Link href="/" className="text-[#5ba3d0] hover:underline">
                  {t.backToHome}
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
