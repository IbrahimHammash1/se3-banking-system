import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { MediaService } from "../services/media.service";
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SWAGGER_TAGS } from "@common/config/swagger-docs.config";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadMediaDTO } from "../dtos/upload-media.dto";
import { MediaEntity } from "../entity/media.entity";
import { FileIsDefinedValidator } from "@common/validation/media/file-is-defined.validator";

@Controller("files")
@ApiTags(SWAGGER_TAGS.FILES)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}
  @Post("upload")
  @UseInterceptors(FileInterceptor("file", { limits: { files: 1 } }))
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadMediaDTO })
  @ApiResponse({ type: MediaEntity })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({ validators: [new FileIsDefinedValidator()] }),
    )
    file,
  ) {
    return MediaEntity.createInstance(
      await this.mediaService.processMedia({ file }),
    );
  }
}
