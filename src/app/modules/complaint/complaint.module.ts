import { Module } from "@nestjs/common";
import { ComplaintController } from "./controllers/complaint.controller";
import { ComplaintService } from "./services/complaint.service";
import { ComplaintRepository } from "./repositories/complaint.repository";
import { ComplaintPdfService } from "./services/complaint-pdf.service";

@Module({
  imports: [],
  controllers: [ComplaintController],
  providers: [ComplaintService, ComplaintRepository, ComplaintPdfService],
  exports: [],
})
export class ComplaintModule {}
