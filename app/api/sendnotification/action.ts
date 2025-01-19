"use server"
import { ProposalService } from "@/services";

export async function getProposals() {
    return await ProposalService.getAllProposals();
}