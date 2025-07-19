import { Request, Response, NextFunction } from "express";
import {
  ForbiddenError,
  NotFoundError,
} from "../../../../core/utils/app-response-errors";
import { sessionDevicesService } from "../../domain/session.devices.service";
import { HttpStatus } from "../../../../core/types/http-statuses";

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
    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    next(e);
  }
}
