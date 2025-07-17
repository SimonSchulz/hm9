import { Request, Response, NextFunction } from "express";
import {
  AuthorizationError,
  ForbiddenError,
  NotFoundError,
} from "../../../../core/utils/app-response-errors";
import { jwtService } from "../../../../auth/domain/jwt.service";
import { sessionDevicesService } from "../../domain/session.devices.service";
import { HttpStatus } from "../../../../core/types/http-statuses";
import { refreshTokenRepository } from "../../../../auth/Repositories/refresh.token.repo";

export async function deleteDevicesByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken: string = req.cookies.refreshToken;
    const payload = req.deviceInfo!;
    const deviceIdToDelete = req.params.deviceId;
    const userSessions = await sessionDevicesService.getAllSessions(
      payload.userId,
    );
    const sessionToDelete = userSessions.find(
      (s) => s.deviceId === deviceIdToDelete,
    );
    if (!sessionToDelete) {
      const sessionExists =
        await sessionDevicesService.getSessionByDeviceId(deviceIdToDelete);
      if (sessionExists) {
        throw new ForbiddenError("Cannot delete session of another user");
      } else {
        throw new NotFoundError("Session not found");
      }
    }
    if (sessionToDelete.userId !== payload.userId) {
      throw new ForbiddenError("Cannot delete session of another user");
    }
    const expiresAt = jwtService.getTokenExpiration(refreshToken);
    await sessionDevicesService.deleteSessionByDeviceId(deviceIdToDelete);
    await refreshTokenRepository.saveInvalidToken({
      userId: payload.userId,
      token: refreshToken,
      expiresAt,
    });
    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    next(e);
  }
}
