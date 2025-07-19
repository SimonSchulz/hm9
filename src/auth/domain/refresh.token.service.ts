import { jwtService } from "./jwt.service";
import { AuthorizationError } from "../../core/utils/app-response-errors";
import { SessionDevicesQueryRepository } from "../../security/devices/repositories/session-query.repository";
import { sessionDevicesService } from "../../security/devices/domain/session.devices.service";

export const refreshService = {
  async refreshToken(oldRefreshToken: string, deviceId: string) {
    if (!oldRefreshToken) {
      throw new AuthorizationError("No refresh token provided");
    }

    const payload = await jwtService.verifyRefreshToken(oldRefreshToken);
    if (!payload) {
      throw new AuthorizationError("Invalid or expired refresh token");
    }
    const session = SessionDevicesQueryRepository.findSessionByDeviceId(
      payload.deviceId,
    );
    if (!session) throw new AuthorizationError();
    const userId = payload.userId;
    const oldExpiresAt = jwtService.getTokenExpiration(oldRefreshToken);
    if (!oldExpiresAt) {
      throw new Error("Can't extract expiration from old refresh token");
    }

    const newAccessToken = await jwtService.createAccessToken(userId);
    const newRefreshToken = await jwtService.createRefreshToken(
      userId,
      deviceId,
    );
    const iat = jwtService.getTokenIssuedAt(newRefreshToken).toISOString();
    await sessionDevicesService.updateLastActiveDate(payload.deviceId, iat);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },
};
