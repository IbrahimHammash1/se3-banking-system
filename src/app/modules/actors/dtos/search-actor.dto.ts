import { PaginationDTO } from "@common/dtos/pagination/pagination.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class SearchActorDTO extends PaginationDTO {
  @ApiPropertyOptional({ type: String, enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
