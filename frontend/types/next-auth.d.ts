import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
      role?: 'STUDENT' | 'FACULTY' | 'ADMIN';
    };
    accessToken?: string;
    expires: string;
  }
}
