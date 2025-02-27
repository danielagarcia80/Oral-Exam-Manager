import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import NextAuth, { SessionOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '../../../../../common/lib/prisma';


const sessionConfig: Partial<SessionOptions> = {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
};
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        return user;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: sessionConfig,
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Ensures the redirect stays within the app
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === 'github') {
        return true; // Allow GitHub login
      }
      if (account?.provider === 'credentials' && user) {
        return true; // Allow email/password users
      }
      return false; // Reject others
    },
    async session({ session, token }: { session: any; token: any }) {
      const payload = {
        name: token.name,
        email: token.email,
        user: token.user,
        sub: token.sub,
        roleId: token.roleId,
        iat: token.iat,
        exp: token.exp,
        jti: token.jti,
      };

      const accessToken = jwt.sign(payload, process.env.NEXTAUTH_SECRET as string);
      session.accessToken = accessToken;

      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {         
        // Add custom claims to the token
        if (user.email) {
          const userRole = await prisma.user.findUnique({
            where: { email: user.email },
            select: { role_id: true, id: true }
          });
          token.user = userRole?.id;
          token.roleId = userRole?.role_id;
        }
        // Add any other user data you want in the token
      }
      return token
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };