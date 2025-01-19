import { EmailService } from "./email-services";
import prisma from "@/database";

export class AdminService {
    static async requestCredentials(): Promise<boolean> {
        try {
            const credentials = await prisma.admin.findFirst();
            const receiverEmail = process.env.NODEMAILER_USERNAME;

            if (credentials && receiverEmail) {
                const subject = "Your Admin Login Credentials";
                const text = `Dear Admin, here are your login credentials: Username: ${credentials.username}, Password: ${credentials.password}. If you encounter any issues logging in, please contact the system maintainers for assistance. Best regards, [Your Company Name or Team Name]`;

                await EmailService.emailSender({
                    receiverEmail,
                    subject,
                    text
                });
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }
}
