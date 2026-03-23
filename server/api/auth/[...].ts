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
      if (user && 'role' in user) {
        token.role = user.role
      }
      return token
    },

    async session({ session, token }) {
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
