import { jwtService } from "./jwt.service";
import { AuthorizationError } from "../../core/utils/app-response-errors";
import { SessionDevicesQueryRepository } from "../../security/devices/repositories/session-query.repository";
import { sessionDevicesService } from "../../security/devices/domain/session.devices.service";

export const refreshService = {
  async refreshToken(deviceId: string) {
    if (!deviceId) {
      throw new AuthorizationError("Device ID is required");
    }
    const session =
      await SessionDevicesQueryRepository.findSessionByDeviceId(deviceId);
    if (!session) throw new AuthorizationError();
    const userId = session.userId;
    const newAccessToken = await jwtService.createAccessToken(userId);
    const newRefreshToken = await jwtService.createRefreshToken(
      userId,
      deviceId,
    );
    const iat = jwtService.getTokenIssuedAt(newRefreshToken).toISOString();
    if (!iat) throw new Error("Can't extract issuedAt from new refresh token");
    await sessionDevicesService.updateLastActiveDate(deviceId, iat);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },
};
