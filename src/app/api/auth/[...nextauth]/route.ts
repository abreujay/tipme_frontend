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
//       async authorize(credentials) {
//         const res = await fetch("http://localhost:3000/users/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             userMail: credentials?.userMail,
//             userPassword: credentials?.userPassword,
//           }),
//         });

//         const data = await res.json();

//         if (res.ok && data.token) {
//           return {
//             id: data.user?.userId || "default-id",
//             token: data.token.token,
//             userId: data.user?.userId || "default-id",
//             avatar: data.user?.avatar || "default-avatar.jpg",
//           };
//         }

//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.accessToken = user.token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string;
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
//       async authorize(credentials) {
//         const res = await fetch("http://localhost:3000/users/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             userMail: credentials?.userMail,
//             userPassword: credentials?.userPassword,
//           }),
//         });

//         const data = await res.json();

//         if (res.ok && data.token) {

//           const userId = data.userId || data.user?.userId || data.user?.id
//           console.log("User ID:", userId); // Debugging log

//           return {
//             id: userId || "default-id",
//             email: credentials?.userMail,
//             token: data.token.token, // JWT
//             userId: userId,
//             avatar: data.user?.avatar || "default-avatar.jpg" // <- adiciona aqui
//           };
//         }

//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.accessToken = user.token;
//         token.userId = user.userId || user.id;
//         token.avatar = user.avatar; // <- adiciona aqui
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string;
//       session.userId = token.userId as string;
//       session.user.id = token.userId as string;
//       session.user.avatar = token.avatar as string; // <- adiciona aqui
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
  //     
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
  console.log("Resposta completa da API:", data);

  // ← A estrutura correta é: data.token.token e data.token.user
  if (res.ok && data.token?.token) {
    const userId = data.token.user?.userId; // ← Caminho correto
    const tokenValue = data.token.token.token; // ← Token aninhado
    const userAvatar = data.token.user?.userAvatar || "default-avatar.jpg";

    console.log("UserId extraído:", userId);
    console.log("Token extraído:", tokenValue);
    console.log("Avatar extraído:", userAvatar);

    const userObject = {
      id: userId,
      email: credentials?.userMail,
      token: tokenValue,
      userId: userId,
      avatar: userAvatar
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