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
    targetedAudience: string;
    technicalSessions: string;
    chiefGuestName: string;
    chiefGuestAlumni: string;
    chiefGuestDesignation: string;
    chiefGuestOnlineProfileLink: string;
    financeSupportOther: string;
    financeSupportSRMIST: string;
    estimatedBudget: string;
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
                `1. Event Convener: ${formData.convenorName}, ${formData.convenorDepartment}`,
            `2. Association Convener: ${formData.associateConvenorName}, ${formData.associateConvenorDepartment}`,
            `3. Organizing Team: ${formData.organizingTeamName}, ${formData.organizingTeamDepartment}`,
            `4. Conducting Department: ${formData.conductingDepartment}`,
            `5. Date: ${formData.date}`,
            `6. Duration: ${formData.duration}`,
            `7. Type of Event: ${formData.typeOfEvent}`,
            `8. Mode of Conduct: ${formData.modeOfConduct}`,
            `9. Number of Registered Teams: ${formData.registeredTeams}`,
            `10. Number of Registered Participants: ${formData.participatedTeams}`,
            `11. Number of Internal Participants: ${formData.internalParticipation}`,
            `12. Targeted Audience: ${formData.targetedAudience}`,
            `13. Number of Technical Sessions: ${formData.technicalSessions}`,
            `14. Chief Guest: ${formData.chiefGuestName}`,
            `15. Alumni (Yes/No): ${formData.chiefGuestAlumni}`,
            `16. Designation: ${formData.chiefGuestDesignation}`,
            `17. Online Profile Link: ${formData.chiefGuestOnlineProfileLink}`,
            `18. Financial Support (Other): ${formData.financeSupportOther}`,
            `19. Financial Support (SRMIST): ${formData.financeSupportSRMIST}`,
            `20. Estimated Budget: ${formData.estimatedBudget}`
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
