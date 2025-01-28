import { useCallback } from "react";
import { saveAs } from "file-saver";

interface FormData {
    eventName: string;
    convenorName: string;
    convenorDepartment: string;
    associateConvenorName: string;
    associateConvenorDepartment: string;
    organizingTeamName: string;
    organizingTeamDepartment: string;
    conductingDepartment: string;
    date: string;
    duration: string;
    typeOfEvent: string;
    modeOfConduct: string;
    registeredTeams: string;
    participatedTeams: string;
    internalParticipation: string;
    externalParticipation: string;
    maleParticipation: string;
    femaleParticipation: string;
    rsParticipation: string;
    facultyParticipation: string;
    industrypersonParticipation: string;
    targetedAudience: string;
    technicalSessions: string;
    chiefGuestName: string;
    chiefGuestAlumni: string;
    chiefGuestDesignation: string;
    chiefGuestOnlineProfileLink: string;
    financeSupportOther: string;
    financeSupportSRMIST: string;
    financeSupportRegistration: string;
    estimatedBudget: string;
    reimAmount: string;
    returnAmount: string;
}

const useGeneratePDF = () => {
    return useCallback(
        async (formData: FormData, descriptions: string[], images: File[]) => {
            const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");

            const pdfDoc = await PDFDocument.create();
            const now = new Date();
            const createdAt = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

            const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            let page = pdfDoc.addPage();
            const { width, height } = page.getSize();

            const bannerImageBytes = await fetch("/banner.png").then((res) => res.arrayBuffer());
            const bannerImage = await pdfDoc.embedPng(bannerImageBytes);
            const bannerWidth = width * 0.5;
            const bannerHeight = (bannerImage.height / bannerImage.width) * bannerWidth;

            const titleFontSize = 14;
            const subtitleFontSize = 12;
            const contentFontSize = 10;
            let yOffset = height - bannerHeight - 80;

            const addNewPage = () => {
                page = pdfDoc.addPage();
                yOffset = height - 40;
            };

            page.drawText(`Report created on: ${createdAt}`, {
                x: 40,
                y: height - 20,
                size: 10,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });

            page.drawImage(bannerImage, {
                x: width / 2 - bannerWidth / 2,
                y: height - bannerHeight - 40,
                width: bannerWidth,
                height: bannerHeight,
            });

            yOffset -= 20;
            page.drawText("SRM INSTITUTE OF SCIENCE AND TECHNOLOGY, KATTANKULATHUR", {
                x: width / 2 - timesRomanFont.widthOfTextAtSize("SRM INSTITUTE OF SCIENCE AND TECHNOLOGY, KATTANKULATHUR", titleFontSize) / 2,
                y: yOffset,
                size: titleFontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });

            yOffset -= 20;
            page.drawText("SCHOOL OF COMPUTING", {
                x: width / 2 - timesRomanFont.widthOfTextAtSize("SCHOOL OF COMPUTING", subtitleFontSize) / 2,
                y: yOffset,
                size: subtitleFontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });

            yOffset -= 20;
            page.drawText("DEPARTMENT OF COMPUTING TECHNOLOGIES", {
                x: width / 2 - timesRomanFont.widthOfTextAtSize("DEPARTMENT OF COMPUTING TECHNOLOGIES", subtitleFontSize) / 2,
                y: yOffset,
                size: subtitleFontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });

            yOffset -= 40;
            page.drawText(`${formData.eventName} EVENT DETAILS`, {
                x: width / 2 - timesRomanFont.widthOfTextAtSize(`${formData.eventName} EVENT DETAILS`, subtitleFontSize) / 2,
                y: yOffset,
                size: subtitleFontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });

            yOffset -= 40;

            const fields = [
                `1. Event Name: ${formData.eventName}`,
                `2. Event Convener: ${formData.convenorName}, ${formData.convenorDepartment}`,
                `3. Association Convener: ${formData.associateConvenorName}, ${formData.associateConvenorDepartment}`,
                `4. Organizing Team: ${formData.organizingTeamName}, ${formData.organizingTeamDepartment}`,
                `5. Conducting Department: ${formData.conductingDepartment}`,
                `6. Date: ${formData.date}`,
                `7. Duration: ${formData.duration}`,
                `8. Type of Event: ${formData.typeOfEvent}`,
                `9. Mode of Conduct: ${formData.modeOfConduct}`,
                `10. Number of Registered Teams: ${formData.registeredTeams}`,
                `11. Number of Registered Participants: ${formData.participatedTeams}`,
                `12. Number of Internal Participants: ${formData.internalParticipation}`,
                `13. Number of External Participants: ${formData.externalParticipation}`,
                `14. Number of Male Participants: ${formData.maleParticipation}`,
                `15. Number of Female Participants: ${formData.femaleParticipation}`,
                `16. Number of RS Participants: ${formData.rsParticipation}`,
                `17. Number of Faculty Participants: ${formData.facultyParticipation}`,
                `18. Number of Industry Person Participants: ${formData.industrypersonParticipation}`,
                `19. Targeted Audience: ${formData.targetedAudience}`,
                `20. Number of Technical Sessions: ${formData.technicalSessions}`,
                `21. Chief Guest: ${formData.chiefGuestName}`,
                `22. Alumni (Yes/No): ${formData.chiefGuestAlumni}`,
                `23. Designation: ${formData.chiefGuestDesignation}`,
                `24. Online Profile Link: ${formData.chiefGuestOnlineProfileLink}`,
                `25. Financial Support (Other): ${formData.financeSupportOther}`,
                `26. Financial Support (SRMIST): ${formData.financeSupportSRMIST}`,
                `27. Financial Support (Registration): ${formData.financeSupportRegistration}`,
                `28. Estimated Budget: ${formData.estimatedBudget}`,
                `29. Reimbursement Amount: ${formData.reimAmount}`,
                `30. Return Amount: ${formData.returnAmount}`
            ];

            fields.forEach((field) => {
                if (yOffset < 40) addNewPage();
                page.drawText(field, {
                    x: 40,
                    y: yOffset,
                    size: contentFontSize,
                    font: timesRomanFont,
                    color: rgb(0, 0, 0),
                });
                yOffset -= 20;
            });

            descriptions.forEach((description, index) => {
                const lines = splitTextIntoLines(`Description ${index + 1}: ${description}`, timesRomanFont, contentFontSize, width - 80);
                lines.forEach((line) => {
                    if (yOffset < 40) addNewPage();
                    page.drawText(line, {
                        x: 40,
                        y: yOffset,
                        size: contentFontSize,
                        font: timesRomanFont,
                        color: rgb(0, 0, 0),
                    });
                    yOffset -= 20;
                });
                yOffset -= 10;
            });

            for (const imgFile of images) {
                const imgBytes = await imgFile.arrayBuffer();
                const img = imgFile.type === "image/png" ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);

                if (yOffset < 220) addNewPage();
                page.drawImage(img, {
                    x: 40,
                    y: yOffset - 200,
                    width: 200,
                    height: 200,
                });
                yOffset -= 220;
            }

            if (yOffset < 60) addNewPage();
            page.drawText("Convenor Signature", {
                x: 40,
                y: 40,
                size: contentFontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });

            page.drawText("HOD Signature", {
                x: width - 100,
                y: 40,
                size: contentFontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });

            const pdfBytes = await pdfDoc.save();
            saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "Event_Report.pdf");
        },
        []
    );
};

const splitTextIntoLines = (text: string, font: any, fontSize: number, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
        const lineWidth = font.widthOfTextAtSize(currentLine + word + " ", fontSize);
        if (lineWidth > maxWidth) {
            lines.push(currentLine);
            currentLine = word + " ";
        } else {
            currentLine += word + " ";
        }
    });

    lines.push(currentLine);
    return lines;
};

export default useGeneratePDF;
