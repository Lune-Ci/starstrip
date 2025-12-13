"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type AdminUser = { id: string; email: string; createdAt: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(data?.error || "Admin API disabled (ENABLE_ADMIN_API=true)");
          return [];
        }
        return res.json();
      })
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to fetch user data"));
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1a3a52]">User List (Dev)</h1>
          <Link href="/">
            <Button
              variant="outline"
              className="border-[#5ba3d0] text-[#5ba3d0]"
            >
              Back to Home
            </Button>
          </Link>
        </div>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <Card className="liquid-glass border-0 p-6">
          <div className="space-y-3">
            {users.length === 0 ? (
              <p className="text-[#4a6b84]">No users or API disabled.</p>
            ) : (
              users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between bg-white/60 rounded-lg p-3"
                >
                  <div>
                    <p className="font-semibold text-[#1a3a52]">{u.email}</p>
                    <p className="text-xs text-[#4a6b84]">
                      Created at: {new Date(u.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs text-[#4a6b84]">ID: {u.id}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
