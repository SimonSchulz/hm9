import { DeviceSessionEntity } from "../types/device-session.entity";
import { SessionDevicesRepository } from "../repositories/session-devices.repository";

export const sessionDevicesService = {
  async getAllSessions(userId: string): Promise<DeviceSessionEntity[]> {
    return SessionDevicesRepository.findAllByUserId(userId);
  },

  async deleteOtherSessions(
    userId: string,
    currentDeviceId: string,
  ): Promise<void> {
    await SessionDevicesRepository.deleteAllExcept(userId, currentDeviceId);
  },

  async deleteSessionByDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    return SessionDevicesRepository.deleteByDeviceId(userId, deviceId);
  },
};
