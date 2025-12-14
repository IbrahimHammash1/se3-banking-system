import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { PrismaBaseError } from "../error-handling/prisma-base-error";
import { Prisma } from "@prisma/client";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    if (exception.code === "P2002") {
      throw new PrismaBaseError({
        message: `Unique constraint violation on Model ${exception.meta?.modelName} on fields [${exception.meta?.target}] `,
        error: "Conflict",
        statusCode: 409,
      });
    }
    if (exception.code === "P2003") {
      throw new PrismaBaseError({
        message: `'No such fk found on field ${exception.meta?.field_name}`,
        error: "Bad Request",
        statusCode: 400,
      });
    }
    if (exception.code === "P2025") {
      throw new PrismaBaseError({
        message: `'${exception.meta?.cause}`,
        error: "Bad Request",
        statusCode: 400,
      });
    }
    throw exception;
  }
}
