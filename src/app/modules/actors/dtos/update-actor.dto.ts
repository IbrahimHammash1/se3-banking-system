import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateActorDto } from "./create-actor.dto";
export class UpdateActorDto extends PartialType(CreateActorDto) {}
export class UpdateProfileDto extends OmitType(UpdateActorDto, [
  "accountStatus",
  "role",
  "password",
] as const) {}
