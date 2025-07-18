import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../../../core/utils/app-response-errors";
import { jwtService } from "../../domain/jwt.service";
import { refreshTokenRepository } from "../../Repositories/refresh.token.repo";
export async function refreshTokenGuard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new AuthorizationError();

  const isBlacklisted =
    await refreshTokenRepository.isTokenInvalidated(refreshToken);
  if (isBlacklisted) {
    throw new AuthorizationError("Refresh token expired");
  }

  const payload = await jwtService.verifyRefreshToken(refreshToken);
  if (!payload) throw new AuthorizationError();

  req.deviceInfo = {
    userId: payload.userId,
    deviceId: payload.deviceId,
  };
  next();
}
