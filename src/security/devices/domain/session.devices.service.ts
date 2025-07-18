import { DeviceSessionEntity } from "../types/device-session.entity";
import { SessionDevicesRepository } from "../repositories/session-devices.repository";
import { WithId } from "mongodb";
import { refreshTokenRepository } from "../../../auth/Repositories/refresh.token.repo";
import { jwtService } from "../../../auth/domain/jwt.service";

export const sessionDevicesService = {
  async getAllSessions(userId: string): Promise<WithId<DeviceSessionEntity>[]> {
    return SessionDevicesRepository.findAllByUserId(userId);
  },

  async getSessionByDeviceId(
    deviceId: string,
  ): Promise<WithId<DeviceSessionEntity> | null> {
    return SessionDevicesRepository.findSessionByDeviceId(deviceId);
  },

  async updateLastActiveDate(deviceId: string) {
    await SessionDevicesRepository.updateLastActiveDate(deviceId);
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
    const allSessions = await SessionDevicesRepository.findAllByUserId(userId);
    const sessionsToDelete = allSessions.filter(
      (s) => s.deviceId !== currentDeviceId,
    );
    const tokensToInvalidate = await Promise.all(
      sessionsToDelete.map(async (session) => {
        const tokenRecord = await refreshTokenRepository.findTokenByDeviceId(
          session.deviceId,
        );
        return tokenRecord?.token;
      }),
    );
    const validTokens = tokensToInvalidate.filter(Boolean);
    await Promise.all(
      validTokens.map((token) => {
        const expiresAt = jwtService.getTokenExpiration(token!);
        return refreshTokenRepository.saveInvalidToken({
          userId,
          token: token!,
          expiresAt,
        });
      }),
    );
    await SessionDevicesRepository.deleteAllExcept(userId, currentDeviceId);
  },

  async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
    return SessionDevicesRepository.deleteByDeviceId(deviceId);
  },
};
