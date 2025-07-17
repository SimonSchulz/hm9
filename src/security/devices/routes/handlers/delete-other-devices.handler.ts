import { Request, Response, NextFunction } from "express";
import {
  AuthorizationError,
  ForbiddenError,
  NotFoundError,
} from "../../../../core/utils/app-response-errors";
import { jwtService } from "../../../../auth/domain/jwt.service";
import { sessionDevicesService } from "../../domain/session.devices.service";
import { HttpStatus } from "../../../../core/types/http-statuses";

export async function deleteOtherSessionsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = req.deviceInfo!;
    const deviceIdToDelete = req.params.deviceId;
    const userSessions = await sessionDevicesService.getAllSessions(
      payload.userId,
    );

    const sessionToDelete = userSessions.find(
      (s) => s.deviceId === deviceIdToDelete,
    );
    if (!sessionToDelete) throw new NotFoundError("Session not found");

    if (sessionToDelete.userId !== payload.userId) {
      throw new ForbiddenError("Cannot delete session of another user");
    }

    await sessionDevicesService.deleteOtherSessions(
      payload.userId,
      payload.deviceId,
    );
    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    next(e);
  }
}
