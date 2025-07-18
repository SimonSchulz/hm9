import { Request, Response, NextFunction } from "express";
import { sessionDevicesService } from "../../domain/session.devices.service";
import { HttpStatus } from "../../../../core/types/http-statuses";

export async function deleteOtherSessionsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = req.deviceInfo!;

    await sessionDevicesService.deleteOtherSessions(
      payload.userId,
      payload.deviceId,
    );
    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    next(e);
  }
}
