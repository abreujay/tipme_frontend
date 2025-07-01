

// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import type { NextAuthOptions } from "next-auth";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         userMail: { label: "Email", type: "text" },
//         userPassword: { label: "Senha", type: "password" },
//       },
//   //     
//   async authorize(credentials) {
//   console.log("=== AUTHORIZE DEBUG ===");
//   console.log("Credentials:", credentials);

//   const res = await fetch("http://localhost:3000/users/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       userMail: credentials?.userMail,
//       userPassword: credentials?.userPassword,
//     }),
//   });

//   const data = await res.json();
//   console.log("Resposta completa da API:", data);

//   // ← A estrutura correta é: data.token.token e data.token.user
//   if (res.ok && data.token?.token) {
//     const userId = data.token.user?.userId; // ← Caminho correto
//     const tokenValue = data.token.token.token; // ← Token aninhado
//     const userAvatar = data.token.user?.userAvatar || "default-avatar.jpg";

//     console.log("UserId extraído:", userId);
//     console.log("Token extraído:", tokenValue);
//     console.log("Avatar extraído:", userAvatar);

//     const userObject = {
//       id: userId,
//       email: credentials?.userMail,
//       token: tokenValue,
//       userId: userId,
//       avatar: userAvatar
//     };

//     console.log("Objeto user que será retornado:", userObject);
//     return userObject;
//   }

//   console.log("Login falhou - res.ok:", res.ok, "data.token:", data.token);
//   return null;
// },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       console.log("=== JWT CALLBACK ===");
//       console.log("User recebido:", user);
//       console.log("Token antes:", token);

//       if (user) {
//         token.accessToken = user.token;
//         token.userId = user.userId || user.id;
//         token.avatar = user.avatar;
//       }

//       console.log("Token depois:", token);
//       return token;
//     },
//     async session({ session, token }) {
//       console.log("=== SESSION CALLBACK ===");
//       console.log("Token recebido:", token);
//       console.log("Session antes:", session);

//       session.accessToken = token.accessToken as string;
//       session.userId = token.userId as string;
//       session.user.id = token.userId as string;
//       session.user.avatar = token.avatar as string;

//       console.log("Session depois:", session);
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };



import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userMail: { label: "Email", type: "text" },
        userPassword: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== AUTHORIZE DEBUG ===");
        console.log("Credentials:", credentials);

        const res = await fetch("http://localhost:3000/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userMail: credentials?.userMail,
            userPassword: credentials?.userPassword,
          }),
        });

        const data = await res.json();
        console.log("Resposta completa da API de login:", data);

        if (res.ok && data.token?.token) {
          // ← Estrutura da API de login: data.token.user
          const userId = data.token.user?.userId;
          const tokenValue = data.token.token.token;
          const userAvatar = data.token.user?.userAvatar || "default-avatar.jpg";
          const userName = data.token.user?.userName || "";
          const artistName = data.token.user?.artistName || "";
          const bio = data.token.user?.bio || "";

          console.log("UserId extraído:", userId);
          console.log("Token extraído:", tokenValue);
          console.log("Avatar extraído:", userAvatar);

          const userObject = {
            id: userId,
            email: credentials?.userMail,
            token: tokenValue,
            userId: userId,
            avatar: userAvatar,
            userName: userName,
            artistName: artistName,
            bio: bio
          };

          console.log("Objeto user que será retornado:", userObject);
          return userObject;
        }

        console.log("Login falhou - res.ok:", res.ok, "data.token:", data.token);
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("=== JWT CALLBACK ===");
      console.log("User recebido:", user);
      console.log("Token antes:", token);

      if (user) {
        token.accessToken = user.token;
        token.userId = user.userId || user.id;
        token.avatar = user.avatar;
        token.userName = user.userName;
        token.artistName = user.artistName;
        token.bio = user.bio;
      }

      console.log("Token depois:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("=== SESSION CALLBACK ===");
      console.log("Token recebido:", token);
      console.log("Session antes:", session);

      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      session.user.id = token.userId as string;
      session.user.avatar = token.avatar as string;
      session.user.userName = token.userName as string;
      session.user.artistName = token.artistName as string;
      session.user.bio = token.bio as string;

      console.log("Session depois:", session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };