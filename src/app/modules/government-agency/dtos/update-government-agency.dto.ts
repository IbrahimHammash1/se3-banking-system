import { PartialType } from "@nestjs/swagger";
import { CreateGovernmentAgencyDto } from "./create-government-agency.dto";

export class UpdateGovernmentAgencyDto extends PartialType(
  CreateGovernmentAgencyDto,
) {}
