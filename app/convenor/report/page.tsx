"use client";
import { useState } from "react";
import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function ReportPage() {
    const [formData, setFormData] = useState({
        eventName: "",
        convenorName: "",
        convenorDepartment: "",
        associateConvenorName: "",
        associateConvenorDepartment: "",
        organizingTeamName: "",
        organizingTeamDepartment: "",
        conductingDepartment: "",
        date: "",
        duration: "",
        typeOfEvent: "",
        modeOfConduct: "",
        registeredTeams: "",
        participatedTeams: "",
        internalParticipation: "",
        targetedAudience: "",
        technicalSessions: "",
        chiefGuestName: "",
        chiefGuestAlumni: "",
        chiefGuestDesignation: "",
        chiefGuestOnlineProfileLink: "",
        financeSupportOther: "",
        financeSupportSRMIST: "",
        estimatedBudget: "",
    });

    const [descriptions, setDescriptions] = useState<string[]>([""]);
    const [images, setImages] = useState<File[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddDescription = () => setDescriptions([...descriptions, ""]);
    const handleDescriptionChange = (index: number, value: string) => {
        const updatedDescriptions = [...descriptions];
        updatedDescriptions[index] = value;
        setDescriptions(updatedDescriptions);
    };

    const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setImages([...images, ...Array.from(e.target.files)]);
    };

    const handleGeneratePDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const now = new Date();
        const createdAt = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        let page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        
        const bannerImageBytes = await fetch("/banner.png").then(res => res.arrayBuffer());
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

        // Draw event name as subheading
        page.drawText(`${formData.eventName} EVENT DETAILS`, {
            x: width / 2 - timesRomanFont.widthOfTextAtSize(`${formData.eventName} EVENT DETAILS`, subtitleFontSize) / 2,
            y: yOffset,
            size: subtitleFontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });

        yOffset -= 40;

        // Draw input fields with page overflow handling
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

        fields.forEach(field => {
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

        // Draw multiple descriptions
        descriptions.forEach((description, index) => {
            const descriptionLines = splitTextIntoLines(`Description ${index + 1}: ${description}`, timesRomanFont, contentFontSize, width - 80);
            descriptionLines.forEach(line => {
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

        // Place multiple images with page overflow handling
        for (const imgFile of images) {
            const imgBytes = await imgFile.arrayBuffer();
            const imgType = imgFile.type === "image/png" ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);

            if (yOffset < 220) addNewPage();
            page.drawImage(imgType, {
                x: 40,
                y: yOffset - 200,
                width: 200,
                height: 200,
            });
            yOffset -= 220;
        }

        // Add signatures at the bottom
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
    };

    // Helper function to split text into lines for multi-page description
    const splitTextIntoLines = (text: string, font: any, fontSize: number, maxWidth: number) => {
        const words = text.split(" ");
        let lines: string[] = [];
        let currentLine = "";

        words.forEach(word => {
            const lineWidth = font.widthOfTextAtSize(currentLine + word + " ", fontSize);
            if (lineWidth > maxWidth) {
                lines.push(currentLine);
                currentLine = word + " ";
            } else {
                currentLine += word + " ";
            }
        });

        lines.push(currentLine); // Push the last line
        return lines;
    };

    return (
        <div className="bg-gradient-to-r from-purple-50 to-blue-300 min-h-screen">
            <div className="flex md:flex-row flex-col justify-between px-5 py-36">
                <div className="w-full md:w-1/2 flex justify-center items-start">
                    <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md border-blue-500 border-4">
                        <h2 className="text-2xl font-bold mb-4">Event Report Form</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Input fields */}
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Event Name</label>
                                    <input type="text" name="eventName" className="border p-2 rounded" value={formData.eventName} onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Event Convener Name</label>
                                    <input type="text" name="convenorName" className="border p-2 rounded" value={formData.convenorName} onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Event Convener Department</label>
                                    <input type="text" name="convenorDepartment" className="border p-2 rounded" value={formData.convenorDepartment} onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Association Convener Name</label>
                                    <input type="text" name="associateConvenorName" className="border p-2 rounded" value={formData.associateConvenorName} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Association Convener Department</label>
                                    <input type="text" name="associateConvenorDepartment" className="border p-2 rounded" value={formData.associateConvenorDepartment} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Organizing Team Name</label>
                                    <input type="text" name="organizingTeamName" className="border p-2 rounded" value={formData.organizingTeamName} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Organizing Team Department</label>
                                    <input type="text" name="organizingTeamDepartment" className="border p-2 rounded" value={formData.organizingTeamDepartment} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Conducting Department</label>
                                    <input type="text" name="conductingDepartment" className="border p-2 rounded" value={formData.conductingDepartment} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Date</label>
                                    <input type="date" name="date" className="border p-2 rounded" value={formData.date} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Duration</label>
                                    <input type="text" name="duration" className="border p-2 rounded" value={formData.duration} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Type of Event</label>
                                    <input type="text" name="typeOfEvent" className="border p-2 rounded" value={formData.typeOfEvent} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Mode of Conduct</label>
                                    <input type="text" name="modeOfConduct" className="border p-2 rounded" value={formData.modeOfConduct} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Number of Registered Teams</label>
                                    <input type="number" name="registeredTeams" className="border p-2 rounded" value={formData.registeredTeams} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Number of Registered Participants</label>
                                    <input type="number" name="participatedTeams" className="border p-2 rounded" value={formData.participatedTeams} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Number of Internal Participants</label>
                                    <input type="number" name="internalParticipation" className="border p-2 rounded" value={formData.internalParticipation} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Targeted Audience</label>
                                    <input type="text" name="targetedAudience" className="border p-2 rounded" value={formData.targetedAudience} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Number of Technical Sessions</label>
                                    <input type="number" name="technicalSessions" className="border p-2 rounded" value={formData.technicalSessions} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Chief Guest Name</label>
                                    <input type="text" name="chiefGuestName" className="border p-2 rounded" value={formData.chiefGuestName} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Chief Guest Alumni (Yes/No)</label>
                                    <input type="text" name="chiefGuestAlumni" className="border p-2 rounded" value={formData.chiefGuestAlumni} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Chief Guest Designation</label>
                                    <input type="text" name="chiefGuestDesignation" className="border p-2 rounded" value={formData.chiefGuestDesignation} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Chief Guest Online Profile Link</label>
                                    <input type="text" name="chiefGuestOnlineProfileLink" className="border p-2 rounded" value={formData.chiefGuestOnlineProfileLink} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Financial Support (Other)</label>
                                    <input type="text" name="financeSupportOther" className="border p-2 rounded" value={formData.financeSupportOther} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Financial Support (SRMIST)</label>
                                    <input type="text" name="financeSupportSRMIST" className="border p-2 rounded" value={formData.financeSupportSRMIST} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Estimated Budget</label>
                                    <input type="text" name="estimatedBudget" className="border p-2 rounded" value={formData.estimatedBudget} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Event Description</label>
                                    {descriptions.map((desc, index) => (
                                        <textarea
                                            key={index}
                                            name={`description-${index}`}
                                            className="border p-2 rounded mb-2"
                                            value={desc}
                                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                        />
                                    ))}
                                    <button type="button" className="text-blue-500" onClick={handleAddDescription}>
                                        + Add Another Description
                                    </button>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="font-medium">Upload Image</label>
                                    <input type="file" accept="image/png, image/jpeg" multiple onChange={handleAddImage} />
                                </div>
                            </div>
                            <button type="button" onClick={handleGeneratePDF} className="bg-blue-500 text-white p-2 rounded mt-4">
                                Generate Report
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
