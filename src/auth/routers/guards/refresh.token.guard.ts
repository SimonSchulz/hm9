import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../../../core/utils/app-response-errors";
import { jwtService } from "../../domain/jwt.service";
import { SessionDevicesQueryRepository } from "../../../security/devices/repositories/session-query.repository";
export async function refreshTokenGuard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new AuthorizationError();

    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) throw new AuthorizationError();
    const session = await SessionDevicesQueryRepository.findSessionByDeviceId(
      payload.deviceId,
    );
    if (!session) throw new AuthorizationError();
    const tokenIat = jwtService.getTokenIssuedAt(refreshToken);
    const tokenIssuedAt = tokenIat.getTime();
    const sessionCreatedAt = new Date(session.lastActiveDate).getTime();

    if (tokenIssuedAt !== sessionCreatedAt) {
      throw new AuthorizationError("Stale or reused refresh token");
    }
    req.deviceInfo = {
      userId: payload.userId,
      deviceId: payload.deviceId,
    };
    next();
  } catch (err) {
    next(err);
  }
}
