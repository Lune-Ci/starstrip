"use client";

import { useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return;
    setSent(true);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-[#1a3a52] mb-6">
            Forgot Password
          </h1>
          <Card className="liquid-glass border-0 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Registered Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#5ba3d0] hover:bg-[#4a92bf]"
                disabled={!isValidEmail(email)}
              >
                Send Reset Link
              </Button>

              {sent && (
                <p className="text-sm text-green-600">
                  Reset link sent. Please check your email.
                </p>
              )}

              <div className="text-sm text-center">
                Remembered your password?
                <Link
                  href="/login"
                  className="text-[#5ba3d0] hover:underline ml-1"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
