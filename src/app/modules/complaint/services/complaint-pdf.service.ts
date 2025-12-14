import { Injectable, NotFoundException } from "@nestjs/common";
import * as PDFDocument from "pdfkit";
import { Response } from "express";
import { ComplaintRepository } from "../repositories/complaint.repository";

@Injectable()
export class ComplaintPdfService {
  constructor(private readonly _complaintRepository: ComplaintRepository) {}

  async generatePdfByComplaintId(complaintId: string, res: Response) {
    const complaint =
      await this._complaintRepository.complaintPdfInfo(complaintId);
    if (!complaint) {
      throw new NotFoundException("Complaint not found");
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="complaint-${complaintId}.pdf"`,
    );

    doc.pipe(res);

    doc.fontSize(16).text("Complaint Report", { align: "center" }).moveDown();

    doc.fontSize(12).text(`Complaint ID: ${complaint.id}`).moveDown();
    doc.text(`Type: ${complaint.type}`).moveDown();
    doc.text(`Status: ${complaint.status}`).moveDown();
    doc.text(`Address: ${complaint.address}`).moveDown();
    doc.text(`Citizen: ${complaint.citizen?.fullName}`).moveDown();

    if (complaint.employee) {
      doc.text(`Processed by: ${complaint.employee.fullName}`).moveDown();
    }

    if (complaint.problemDescription) {
      doc
        .text(`Problem Description: ${complaint.problemDescription}`)
        .moveDown();
    }

    if (complaint.extraInfo) {
      doc.text(`Extra Info: ${complaint.extraInfo}`).moveDown();
    }

    if (complaint.employeeNotes) {
      doc.text(`Employee Notes: ${complaint.employeeNotes}`).moveDown();
    }

    doc
      .text(`Government Agency: ${complaint.governmentAgency.name}`)
      .moveDown();

    if (complaint.complaintExtraDatas.length > 0) {
      doc.text("Extra Data:", { underline: true }).moveDown();
      complaint.complaintExtraDatas.forEach((extraData) => {
        doc.text(`${extraData.key}: ${extraData.value}`).moveDown();
      });
    }

    if (complaint.complaintFiles.length > 0) {
      doc.text("Complaint Files:", { underline: true }).moveDown();
      complaint.complaintFiles.forEach((file) => {
        doc.text(`File ID: ${file.fileId}`).moveDown();
      });
    }

    doc
      .addPage()
      .fontSize(16)
      .text("Complaint History", { align: "center" })
      .moveDown();

    complaint.complaintHistories.forEach((history, index) => {
      doc
        .fontSize(12)
        .text(`Version ${history.version}`, { underline: true })
        .moveDown();

      doc.text(`Status: ${history.status}`).moveDown();
      doc.text(`Type: ${history.type}`).moveDown();
      doc.text(`Address: ${history.address}`).moveDown();
      doc
        .text(`Problem Description: ${history.problemDescription || "N/A"}`)
        .moveDown();
      doc.text(`Extra Info: ${history.extraInfo || "N/A"}`).moveDown();
      doc.text(`Employee Notes: ${history.employeeNotes || "N/A"}`).moveDown();
      doc
        .text(`Government Agency ID: ${history.governmentAgencyId}`)
        .moveDown();

      const updatedFields = history.updatedFields;

      if (updatedFields) {
        doc.text("Updated Fields:", { underline: true }).moveDown();
        for (const [key, value] of Object.entries(updatedFields)) {
          if (value === true) {
            doc.text(`${key} was updated`).moveDown();
          }
        }
      }

      if (index < complaint.complaintHistories.length - 1) {
        doc.addPage();
      }
    });

    doc.end();
  }
}
