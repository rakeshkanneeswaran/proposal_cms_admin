'use server'
import { AdminService } from "@/services";
export async function requestCredentials() {
    try {
        const result = await AdminService.requestCredentials()
        return result

    } catch (error) {
        throw error
    }
}