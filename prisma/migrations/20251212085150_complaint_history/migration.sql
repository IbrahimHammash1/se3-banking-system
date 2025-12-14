-- CreateTable
CREATE TABLE "ComplaintHistory" (
    "id" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "version" DOUBLE PRECISION NOT NULL,
    "type" "ComplaintType" NOT NULL,
    "status" "ComplaintStatus" NOT NULL,
    "address" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "problemDescription" TEXT,
    "extraInfo" TEXT,
    "employeeNotes" TEXT,
    "governmentAgencyId" TEXT NOT NULL,
    "processingByEmployeeId" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedByEmployeeId" TEXT NOT NULL,
    "updatedFields" JSONB NOT NULL,

    CONSTRAINT "ComplaintHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ComplaintHistory_complaintId_version_idx" ON "ComplaintHistory"("complaintId", "version");

-- AddForeignKey
ALTER TABLE "ComplaintHistory" ADD CONSTRAINT "ComplaintHistory_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
