import { SWAGGER_TAGS } from "@common/config/swagger-docs.config";
import { Body, Controller, Patch } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { DevicesService } from "../services/devices.service";
import { DeviceEntity } from "../entities/device.entity";
import { CreateDeviceDto } from "../dtos/create-device.dto";

@Controller({
  path: "devices",
})
@ApiTags(SWAGGER_TAGS.DEVICES)
export class DevicesController {
  constructor(private readonly _devicesService: DevicesService) {}

  @Patch("")
  @ApiResponse({ type: DeviceEntity })
  async upsert(@Body() createDeviceDto: CreateDeviceDto) {
    const device = await this._devicesService.upsert(createDeviceDto);
    return DeviceEntity.createInstance(device);
  }
}
