-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "ip" TEXT,
    "platform" TEXT,
    "userAgent" TEXT,
    "params" JSONB,
    "query" JSONB,
    "body" JSONB,
    "response" JSONB,
    "statusCode" INTEGER NOT NULL,
    "errorMessage" TEXT,
    "errorStack" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
