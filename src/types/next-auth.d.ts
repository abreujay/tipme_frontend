

// // types/next-auth.d.ts
// import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     userId: string; // <- adicione isso
//     accessToken?: string;
//     user: {
//       id?: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//       avatar?: string; // <- opcional: se quiser digitar corretamente também
//     };
//   }

//   interface User {
//     id: string;
//     userId: string;
//     avatar?: string;
//     token?: string; // <- opcional: se quiser digitar corretamente também
//   }

//   interface JWT {
//     userId: string;
//     accessToken?: string;
//     avatar?: string;
//   }
// }


// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    userId?: string;
    user: {
      id: string;
      email?: string;
      name?: string;
      avatar?: string;
      userName?: string;        // ← Novo
      artistName?: string;      // ← Novo
      bio?: string;            // ← Novo
    }
  }

  interface User {
    id: string;
    token: string;
    userId?: string;
    avatar?: string;
    userName?: string;          // ← Novo
    artistName?: string;        // ← Novo
    bio?: string;              // ← Novo
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    userId?: string;
    avatar?: string;
    userName?: string;          // ← Novo
    artistName?: string;        // ← Novo
    bio?: string;              // ← Novo
  }
}