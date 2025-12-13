"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Captcha } from "@/components/ui/captcha";
import { useAuthStore } from "@/lib/auth-store";
import Link from "next/link";
import { Mail, Lock, Chrome, Facebook, Github, Linkedin } from "lucide-react";
import { signIn, getProviders } from "next-auth/react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const { loginWithEmail, loginWithProvider, setRemember, remember } =
    useAuthStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    getProviders()
      .then((res) => setProviders(res || null))
      .catch(() => setProviders(null));
  }, []);

  const canSubmit = useMemo(() => {
    return isValidEmail(email) && password.length >= 6 && captchaValid;
  }, [email, password, captchaValid]);

  const enabled = {
    google: Boolean(providers?.google),
    facebook: Boolean(providers?.facebook),
    github: Boolean(providers?.github),
    linkedin: Boolean(providers?.linkedin),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) {
      setError(t.invalidEmailFormat);
      return;
    }
    if (password.length < 6) {
      setError(t.passwordMinLength);
      return;
    }
    if (!captchaValid) {
      setError(t.pleasePassCaptcha);
      return;
    }
    loginWithEmail(email, remember);
    router.push(redirect);
  };

  const handleGoogle = async () => {
    await signIn("google", { callbackUrl: redirect });
  };

  const handleFacebook = async () => {
    await signIn("facebook", { callbackUrl: redirect });
  };

  const showGoogle = Boolean(providers?.google);
  const showFacebook = Boolean(providers?.facebook);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-[#1a3a52] mb-6">{t.signIn}</h1>
          {params.get("upgrade") === "1" && (
            <div className="mb-4 text-sm text-[#4a6b84]">
              After signing in, your current favorites and routes will be
              merged.
            </div>
          )}
          <Card className="liquid-glass border-0 p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                if (!isValidEmail(email)) {
                  setError(t.invalidEmailFormat);
                  return;
                }
                if (password.length < 6) {
                  setError(t.passwordMinLength);
                  return;
                }
                if (!captchaValid) {
                  setError(t.pleasePassCaptcha);
                  return;
                }
                signIn("credentials", {
                  email,
                  password,
                  callbackUrl: redirect,
                });
              }}
              className="space-y-4"
            >
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
                {!isValidEmail(email) && email.length > 0 && (
                  <p className="text-sm text-red-600">{t.invalidEmailFormat}</p>
                )}
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

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(Boolean(v))}
                />
                <Label htmlFor="remember">{t.rememberMe}</Label>
              </div>

              <Captcha onValidChange={setCaptchaValid} />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-[#5ba3d0] hover:bg-[#4a92bf]"
                disabled={!canSubmit}
              >
                {t.signIn}
              </Button>

              <div className="flex items-center gap-2">
                <div className="h-px bg-[#dbe5ec] w-full" />
                <span className="text-xs text-[#4a6b84]">{t.or}</span>
                <div className="h-px bg-[#dbe5ec] w-full" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={enabled.google ? handleGoogle : undefined}
                  disabled={!enabled.google}
                  title={enabled.google ? undefined : "Provider not configured"}
                  className="w-full"
                >
                  <Chrome className="h-4 w-4 mr-2" /> {t.signInWithGoogle}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={enabled.facebook ? handleFacebook : undefined}
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
                      ? () => signIn("github", { callbackUrl: redirect })
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
                      ? () => signIn("linkedin", { callbackUrl: redirect })
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

              <div className="flex justify-between text-sm">
                <Link
                  href="/register"
                  className="text-[#5ba3d0] hover:underline"
                >
                  {t.createAccount}
                </Link>
                <Link
                  href="/forgot-password"
                  className="text-[#5ba3d0] hover:underline"
                >
                  {t.forgotPassword}
                </Link>
              </div>
              <div className="mt-4">
                <Link
                  href="/"
                  className="text-[#5ba3d0] hover:underline text-sm"
                >
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className="container mx-auto px-4 py-8">Loading...</div>
        </MainLayout>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
