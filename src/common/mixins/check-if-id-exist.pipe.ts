import { PrismaService } from "@core/modules/prisma/services/prisma.service";
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  mixin,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
type Models = keyof typeof Prisma.ModelName;

export const checkIfIdExist = <T extends Models>(modelName: T) => {
  @Injectable()
  class CheckIfIdExistPipe implements PipeTransform<number | string> {
    constructor(public readonly prismaService: PrismaService) {}
    async transform(value: string | number, metadata: ArgumentMetadata) {
      const foundRecord = await this.prismaService[
        modelName as Prisma.ModelName
      ].findUnique({
        where: {
          id: String(value),
        },
      });
      if (!foundRecord) {
        throw new NotFoundException(`${modelName} not found`);
      }
      return value;
    }
  }
  return mixin(CheckIfIdExistPipe);
};
