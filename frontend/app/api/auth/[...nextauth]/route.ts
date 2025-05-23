import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '../../../../../common/lib/prisma';

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

        return {
          id: user.user_id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
        };
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account }) {
      return !!user && !!account;
    },

    async jwt({ token, user }) {
      // When user first logs in
      if (user) {
        const userInDb = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            user_id: true,
            role: true,
            first_name: true,
            last_name: true,
          },
        });

        token.id = userInDb?.user_id;
        token.role = userInDb?.role;
        token.name = `${userInDb?.first_name} ${userInDb?.last_name}`;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
      }

      // Optional: create a signed access token
      const accessTokenPayload = {
        id: token.id,
        email: token.email,
        role: token.role,
        name: token.name,
      };

      session.accessToken = jwt.sign(accessTokenPayload, process.env.NEXTAUTH_SECRET!, {
        expiresIn: '30d',
      });

      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
