import { ApiProperty } from "@nestjs/swagger";

export class UploadMediaDTO {
  @ApiProperty({
    description: "Uploaded media file",
    format: "binary",
    required: true,
    type: "string",
  })
  file: Express.Multer.File;
}
