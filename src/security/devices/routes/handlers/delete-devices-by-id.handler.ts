import { Request, Response, NextFunction } from "express";
import {
  ForbiddenError,
  NotFoundError,
} from "../../../../core/utils/app-response-errors";
import { sessionDevicesService } from "../../domain/session.devices.service";
import { HttpStatus } from "../../../../core/types/http-statuses";
import { refreshTokenRepository } from "../../../../auth/Repositories/refresh.token.repo";

export async function deleteDevicesByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const currentPayload = req.deviceInfo!;
    const deviceIdToDelete = req.params.deviceId;

    const sessionToDelete =
      await sessionDevicesService.getSessionByDeviceId(deviceIdToDelete);

    if (!sessionToDelete) {
      throw new NotFoundError("Session not found");
    }

    if (sessionToDelete.userId !== currentPayload.userId) {
      throw new ForbiddenError("Cannot delete session of another user");
    }

    await sessionDevicesService.deleteSessionByDeviceId(deviceIdToDelete);

    const tokens =
      await refreshTokenRepository.findTokensByDeviceId(deviceIdToDelete);

    for await (const token of tokens) {
      await refreshTokenRepository.saveInvalidToken({
        userId: token.userId,
        token: token.token,
        expiresAt: token.expiresAt,
      });
    }

    res.sendStatus(HttpStatus.NoContent); // 204
  } catch (e) {
    next(e);
  }
}
