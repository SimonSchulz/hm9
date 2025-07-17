import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { LoginSuccessViewModel } from "../../types/login-success-view-model";
import { SETTINGS } from "../../../core/setting/setting";
import { refreshService } from "../../domain/refresh.token.service";
import { AuthorizationError } from "../../../core/utils/app-response-errors";
import { refreshTokenRepository } from "../../Repositories/refresh.token.repo";
import { jwtService } from "../../domain/jwt.service";
import { sessionDevicesService } from "../../../security/devices/domain/session.devices.service";

export async function refreshTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      throw new AuthorizationError("No refresh token provided");
    }
    const isBlacklisted =
      await refreshTokenRepository.isTokenInvalidated(oldRefreshToken);
    if (isBlacklisted) {
      throw new AuthorizationError("Refresh token not found or already used");
    }
    const payload = await jwtService.verifyRefreshToken(oldRefreshToken);
    if (!payload)
      throw new AuthorizationError("Refresh token not found or already used");
    const tokens = await refreshService.refreshToken(
      oldRefreshToken,
      payload.deviceId,
    );
    await sessionDevicesService.updateLastActiveDate(payload.deviceId);
    res
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: Number(SETTINGS.RF_TIME) * 1000,
      })
      .status(HttpStatus.Ok)
      .send({ accessToken: tokens.accessToken } as LoginSuccessViewModel);
  } catch (error) {
    next(error);
  }
}
