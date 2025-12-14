import { ApiProperty } from "@nestjs/swagger";
import { Filetype } from "@prisma/client";
import { MediaPayload } from "../validators/select-media.validator";
import { envConfig } from "@common/config/env-config";
import { PaginationMixin } from "@common/mixins/pagination.mixin";

export class MediaEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  url: string | URL;

  @ApiProperty({ type: String })
  fileName: string;

  @ApiProperty({ type: String, enum: Filetype })
  type: Filetype;

  @ApiProperty({ type: Number })
  size: number;

  constructor(mediaPayload: MediaPayload) {
    this.id = mediaPayload.id;
    this.fileName = mediaPayload.fileName;
    this.size = Number(mediaPayload.size);
    this.url = this.constructLocalFileUrl(this.fileName);
  }

  static createInstance(
    payload: MediaPayload | MediaPayload[],
  ): MediaEntity | MediaEntity[] {
    if (Array.isArray(payload)) {
      return payload.map((payloadItem) => new MediaEntity(payloadItem));
    }
    return new MediaEntity(payload);
  }

  private constructLocalFileUrl(fileName: string) {
    return new URL(`${envConfig.MEDIA_PATH}/${fileName}`, envConfig.BASE_URL);
  }
}

export class MediaEntities extends PaginationMixin(MediaEntity) {}
