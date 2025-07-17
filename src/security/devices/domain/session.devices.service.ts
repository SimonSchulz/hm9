import { DeviceSessionEntity } from "../types/device-session.entity";
import { SessionDevicesRepository } from "../repositories/session-devices.repository";

export const sessionDevicesService = {
  async getAllSessions(userId: string): Promise<DeviceSessionEntity[]> {
    return SessionDevicesRepository.findAllByUserId(userId);
  },
  async createSession(
    ip: string,
    title: string,
    userId: string,
    deviceId: string,
  ): Promise<DeviceSessionEntity> {
    const session = new DeviceSessionEntity(ip, title, userId, deviceId);
    return SessionDevicesRepository.create(session);
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
