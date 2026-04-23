import { NuxtAuthHandler } from '#auth'
import CredentialsProvider from 'next-auth/providers/credentials'

type Credentials = {
  username: string
  password: string
}

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,

  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials: Credentials) {
        const { username, password } = credentials

        if (username === 'admin_w' && password === '123456') {
          return {
            id: '1',
            name: 'Winnie',
            role: 'admin',
          }
        }

        return null
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // 第一次登入時 -> 存token
      if (user && 'role' in user) {
        token.role = user.role
      }
      return token
    },

    async session({ session, token }) {
      // 整理給前端的資料
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
        },
      }
    },
  },

  pages: {
    signIn: '/admin/login',
  },
})
