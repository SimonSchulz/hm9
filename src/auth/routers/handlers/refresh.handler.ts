import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { LoginSuccessViewModel } from "../../types/login-success-view-model";
import { sessionDevicesService } from "../../../security/devices/domain/session.devices.service";
import { refreshService } from "../../domain/refresh.token.service";
import { jwtService } from "../../domain/jwt.service";

export async function refreshTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const payload = req.deviceInfo!;
    const tokens = await refreshService.refreshToken(
      refreshToken,
      payload.deviceId,
    );
    const iat = jwtService.getTokenIssuedAt(tokens.refreshToken).toISOString();
    await sessionDevicesService.updateLastActiveDate(payload.deviceId, iat);
    res
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(HttpStatus.Ok)
      .send({ accessToken: tokens.accessToken } as LoginSuccessViewModel);
  } catch (error) {
    next(error);
  }
}
