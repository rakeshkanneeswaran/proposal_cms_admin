import prisma from "@/database";

export class ProposalService {
    static async getAllProposals() {
        return await prisma.proposal.findMany();
    }
}