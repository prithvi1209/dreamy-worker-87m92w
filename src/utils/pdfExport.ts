import { Flashcard } from "../types";

// Using jsPDF for PDF generation
export const exportToPDF = async (
  flashcards: Flashcard[],
  collectionName: string
) => {
  try {
    // Dynamic import of jsPDF
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Title page
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(collectionName, pageWidth / 2, 40, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Cards: ${flashcards.length}`, pageWidth / 2, 50, {
      align: "center",
    });
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      58,
      { align: "center" }
    );

    // Add flashcards (one per page in slide format)
    flashcards.forEach((card, index) => {
      doc.addPage();

      // Card number and type
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Card ${index + 1} of ${flashcards.length}`, margin, margin);
      doc.text(`[${card.type.toUpperCase()}]`, pageWidth - margin, margin, {
        align: "right",
      });

      // Front of card (Question)
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Question:", margin, 40);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const frontText = stripHtml(card.front);
      const frontLines = doc.splitTextToSize(frontText, contentWidth);
      doc.text(frontLines, margin, 50);

      // Divider line
      const dividerY = 50 + frontLines.length * 7 + 10;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, dividerY, pageWidth - margin, dividerY);

      // Back of card (Answer)
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Answer:", margin, dividerY + 15);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const backText = stripHtml(card.back);
      const backLines = doc.splitTextToSize(backText, contentWidth);
      doc.text(backLines, margin, dividerY + 25);

      // Add options for MCQ
      if (card.options && card.options.length > 0) {
        const optionsY = dividerY + 25 + backLines.length * 7 + 10;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Options:", margin, optionsY);

        doc.setFont("helvetica", "normal");
      ...questions.map((option: string, optIdx: number) => {
          const isCorrect = option === card.correctAnswer;
          const optionText = `${String.fromCharCode(65 + optIdx)}. ${option}${
            isCorrect ? " ✓" : ""
          }`;
          doc.text(optionText, margin + 5, optionsY + 7 + optIdx * 7);
        });
      }

      // Add explanation if available
      if (card.explanation) {
        const explanationY = pageHeight - margin - 20;
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(80, 80, 80);
        const explText = doc.splitTextToSize(
          `💡 ${card.explanation}`,
          contentWidth
        );
        doc.text(explText, margin, explanationY);
      }

      // Page number
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${index + 2}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      });
    });

    // Save the PDF
    doc.save(
      `${collectionName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_flashcards.pdf`
    );
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try exporting as text instead.");
  }
};

const stripHtml = (html: string): string => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};
