/*
  Warnings:

  - A unique constraint covering the columns `[complaintId,fileId]` on the table `ComplaintFiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ComplaintFiles_complaintId_fileId_key" ON "ComplaintFiles"("complaintId", "fileId");
