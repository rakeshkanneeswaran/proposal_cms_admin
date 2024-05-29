import prisma from "@/database";
import CredentialsProvider from "next-auth/providers/credentials"
import emailsender from "@/emails";


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Your Username" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any) {
                try {
                    // Use the singleton PrismaClient instance to query the database
                    const existingUser = await prisma.admin.findFirst({
                        where: {
                            username: credentials.username,
                            password: credentials.password
                        }
                    });

                    if (existingUser) {
                        console.log(existingUser)
                        console.log("secret")
                        emailsender({ receiverEmail: "rakikanneeswaran@gmail.com", subject: "Sign-in Detected on Ctechevent Connect", text: "If you haven't signed in, please contact the administrators immediately." });
                        return {
                            id: existingUser.username,
                            name: existingUser.username
                        };
                    } 
                    
                    else {
                        return null; // Return null if user not found or credentials are invalid
                    }
                } catch (error) {
                    console.error("Error during authentication:", error);
                    return null; // Handle errors gracefully
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/signin',
    }
};

export default authOptions;

