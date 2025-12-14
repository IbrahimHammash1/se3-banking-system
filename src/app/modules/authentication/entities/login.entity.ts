import { ApiProperty } from "@nestjs/swagger";
import { ActorPayload } from "../../actors/validators/select-actor.validator";
import { ActorEntity } from "../../actors/entities/actor.entity";

type LoginPayload = {
  accessToken: string;
  actor: ActorPayload;
};

export class LoginEntity {
  @ApiProperty({ type: String })
  accessToken: string;

  @ApiProperty({ type: ActorEntity })
  actor: ActorEntity;

  constructor(obj: LoginPayload) {
    this.accessToken = obj.accessToken;
    this.actor = ActorEntity.createInstance(obj.actor) as ActorEntity;
  }

  static createInstance(
    payload: LoginPayload | LoginPayload[],
  ): LoginEntity | LoginEntity[] {
    if (Array.isArray(payload)) {
      return payload.map((payloadItem) => new LoginEntity(payloadItem));
    }
    return new LoginEntity(payload);
  }
}
