import { Injectable } from "@nestjs/common";
import { DevicesRepository } from "../repositories/devices.repository";
import { CreateDeviceDto } from "../dtos/create-device.dto";

@Injectable()
export class DevicesService {
  constructor(private readonly _devicesRepository: DevicesRepository) {}

  // TODO: update the current session with current device id , implement logout functionality , add session id to payload in jwt token
  async upsert(createDeviceDto: CreateDeviceDto) {
    return this._devicesRepository.upsert(createDeviceDto);
  }

  async getActorFcmTokens(actorId: string) {
    return this._devicesRepository.getActorFcmTokens(actorId);
  }
}
