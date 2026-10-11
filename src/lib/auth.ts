import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client } from "@/lib/mongodb";

export const auth = betterAuth({
    database: mongodbAdapter(client.db(), {
        client,
    }),

    // CORS এবং Multiple Domain Allow করার জন্য:
    trustedOrigins: [
        "https://pha-7-bazardor.vercel.app",
        "https://n06mx-theabidkhan.vercel.app",
        "http://localhost:3000",
    ],

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },

        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        },
    },
});