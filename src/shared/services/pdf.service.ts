import { Injectable } from "@nestjs/common";
import PDFDocument from "pdfkit";
@Injectable()
export class PdfService {
  async generateTablePdf(
    title: string,
    headers: string[],
    data: Record<string, any>[],
    columns: string[],
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ autoFirstPage: false, margin: 50 });
      const buffers: Buffer[] = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(new Error(err.message)));
      const drawPage = (startRow: number): number => {
        doc.addPage();
        doc
          .fontSize(18)
          .font("Helvetica-Bold")
          .text(title, { align: "center" });
        doc.moveDown(2);
        const tableTop = doc.y;
        const pageMargin = 50;
        const availableWidth = doc.page.width - pageMargin * 2;
        const columnWidth = availableWidth / headers.length;
        let y = tableTop;
        const drawRow = (
          rowData: string[],
          isHeader: boolean,
          currentY: number,
        ): number => {
          doc
            .fontSize(isHeader ? 10 : 8)
            .font(isHeader ? "Helvetica-Bold" : "Helvetica");
          let maxRowHeight = 0;
          rowData.forEach((cell, i) => {
            const cellHeight = doc.heightOfString(String(cell), {
              width: columnWidth,
            });
            if (cellHeight > maxRowHeight) {
              maxRowHeight = cellHeight;
            }
          });
          const rowHeight = maxRowHeight + 10;
          if (currentY + rowHeight > doc.page.height - pageMargin) {
            return -1;
          }
          rowData.forEach((cell, i) => {
            const cellX = pageMargin + i * columnWidth;
            doc.text(String(cell), cellX + 5, currentY, {
              width: columnWidth - 10,
              align: "left",
            });
          });
          doc
            .moveTo(pageMargin, currentY + rowHeight - 5)
            .lineTo(doc.page.width - pageMargin, currentY + rowHeight - 5)
            .strokeColor(isHeader ? "#000000" : "#dddddd")
            .stroke();
          return currentY + rowHeight;
        };
        y = drawRow(headers, true, y);
        let i = startRow;
        for (; i < data.length; i++) {
          const rowData = columns.map((key) => data[i][key] ?? "N/A");
          const nextY = drawRow(rowData, false, y);
          if (nextY === -1) {
            return i;
          }
          y = nextY;
        }
        return i;
      };
      let startRow = 0;
      while (startRow < data.length) {
        startRow = drawPage(startRow);
      }
      doc.end();
    });
  }
}
