import { DeviceSessionEntity } from "../types/device-session.entity";
import { SessionDevicesRepository } from "../repositories/session-devices.repository";
import { WithId } from "mongodb";
import { SessionDevicesQueryRepository } from "../repositories/session-query.repository";

export const sessionDevicesService = {
  async getAllSessions(userId: string): Promise<WithId<DeviceSessionEntity>[]> {
    return SessionDevicesQueryRepository.findAllByUserId(userId);
  },

  async getSessionByDeviceId(
    deviceId: string,
  ): Promise<WithId<DeviceSessionEntity> | null> {
    return SessionDevicesQueryRepository.findSessionByDeviceId(deviceId);
  },

  async updateLastActiveDate(deviceId: string, iat: string) {
    await SessionDevicesRepository.updateLastActiveDate(deviceId, iat);
  },
  async createSession(
    ip: string,
    title: string,
    userId: string,
    deviceId: string,
    iat: string,
  ): Promise<DeviceSessionEntity> {
    const session = new DeviceSessionEntity(ip, title, userId, deviceId, iat);
    return SessionDevicesRepository.create(session);
  },
  async deleteOtherSessions(
    userId: string,
    currentDeviceId: string,
  ): Promise<void> {
    await SessionDevicesRepository.deleteAllExcept(userId, currentDeviceId);
  },

  async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
    return SessionDevicesRepository.deleteByDeviceId(deviceId);
  },
};
