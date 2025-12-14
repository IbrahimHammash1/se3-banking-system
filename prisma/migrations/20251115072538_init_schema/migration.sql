-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPLOYEE', 'CITIZEN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'NOT_ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('SIGN_UP', 'EMAIL', 'SMS');

-- CreateEnum
CREATE TYPE "ComplaintType" AS ENUM ('CIVIAL_RIGHTS', 'SERVICES', 'ENVIRONMENTAL', 'LAW');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('NEW', 'PROCESSING', 'DONE', 'REJECTED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "Filetype" AS ENUM ('video', 'image', 'document', 'pdf', 'excel', 'csv');

-- CreateTable
CREATE TABLE "Actor" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationalId" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "imageId" TEXT,
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'NOT_ACTIVE',
    "governmentAgencyId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CITIZEN',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "type" "ComplaintType" NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'NEW',
    "address" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "processingByEmployeeId" TEXT,
    "problemDescription" TEXT,
    "extraInfo" TEXT,
    "employeeNotes" TEXT,
    "version" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "governmentAgencyId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplaintFiles" (
    "id" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ComplaintFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "type" "Filetype" NOT NULL,
    "fileName" TEXT NOT NULL,
    "thumbnailName" TEXT,
    "size" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernmentAgency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "GovernmentAgency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "otpCode" TEXT,
    "otpExpireAt" TIMESTAMPTZ(6),
    "retriesCount" INTEGER NOT NULL DEFAULT 3,
    "refreshToken" TEXT,
    "type" "SessionType" NOT NULL,
    "actorId" TEXT NOT NULL,
    "expireAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Actor_email_key" ON "Actor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Actor_phone_key" ON "Actor"("phone");

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_governmentAgencyId_fkey" FOREIGN KEY ("governmentAgencyId") REFERENCES "GovernmentAgency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_processingByEmployeeId_fkey" FOREIGN KEY ("processingByEmployeeId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_governmentAgencyId_fkey" FOREIGN KEY ("governmentAgencyId") REFERENCES "GovernmentAgency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintFiles" ADD CONSTRAINT "ComplaintFiles_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintFiles" ADD CONSTRAINT "ComplaintFiles_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
