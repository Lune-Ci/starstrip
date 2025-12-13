import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import { findUserByEmail, verifyPassword } from "@/lib/server/user-store";

async function buildAuthOptions(): Promise<NextAuthOptions> {
  const providers: NextAuthOptions["providers"] = [];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    );
  }

  if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    providers.push(
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      })
    );
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.push(
      GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    );
  }

  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    providers.push(
      LinkedInProvider({
        clientId: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      })
    );
  }

  providers.push(
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;
        const user = findUserByEmail(email);
        if (!user) return null;
        const ok = verifyPassword(password, user);
        if (!ok) return null;
        return { id: user.id, email: user.email };
      },
    })
  );

  return {
    providers,
    session: { strategy: "jwt" },
    callbacks: {
      async jwt({ token, account, user }) {
        if (account) token.provider = account.provider;
        else if (user && !(token as any).provider)
          (token as any).provider = "credentials";
        if (user?.email) token.email = user.email;
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          (session.user as any).id = token.sub;
          (session.user as any).provider =
            (token as any).provider || "credentials";
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
}

export async function GET(
  req: Request,
  context: { params: { nextauth: string[] } }
) {
  const handler = NextAuth(await buildAuthOptions());
  // Pass along route params so NextAuth can resolve the dynamic segments
  // @ts-ignore - NextAuth handler is compatible with Next's Route Handler signature
  return handler(req, context);
}

export async function POST(
  req: Request,
  context: { params: { nextauth: string[] } }
) {
  const handler = NextAuth(await buildAuthOptions());
  // @ts-ignore
  return handler(req, context);
}
