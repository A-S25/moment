import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../prisma/client"
import { NextAuthOptions } from "next-auth"

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    // 🔹 يحفظ بيانات إضافية داخل الـ JWT
    async jwt({ token, user }) {
      // أول لوسن تسجيل دخول، يكون فيه user من الـ DB
      if (user) {
        // نخزن الـ id في التوكن
        // تقدر تغيرين الاسم لو حبيتي
        ;(token as any).id = (user as any).id
      }

      return token
    },

    // 🔹 يعدل الـ session اللي ترجع لـ useSession و getServerSession
    async session({ session, token }) {
      if (session.user && token) {
        // نرجّع الـ id من التوكن للسيشن
        ;(session.user as any).id = (token as any).id || token.sub
      }

      return session
    }
  },
}

export default authOptions
