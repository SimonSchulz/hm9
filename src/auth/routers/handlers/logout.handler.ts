import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { AuthorizationError } from "../../../core/utils/app-response-errors";
import { jwtService } from "../../domain/jwt.service";
import { sessionDevicesService } from "../../../security/devices/domain/session.devices.service";

export async function logoutHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AuthorizationError("No refresh token provided");
    }
    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new AuthorizationError("Invalid refresh token provided");
    }
    await sessionDevicesService.deleteSessionByDeviceId(payload.deviceId);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    next(error);
  }
}
