import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../../../core/utils/app-response-errors";
import { jwtService } from "../../domain/jwt.service";
export async function refreshTokenGuard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new AuthorizationError();

  const payload = await jwtService.verifyRefreshToken(refreshToken);
  if (!payload) throw new AuthorizationError();

  req.deviceInfo = {
    userId: payload.userId,
    deviceId: payload.deviceId,
  };
  next();
}
