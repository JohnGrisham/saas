import NextAuth from 'next-auth';
import providers from 'auth';

export default NextAuth({
  providers,
  secret: process.env.JWT_SECRET,
});
