import { NextFunction, Request, Response } from "express";
import { sessionDevicesService } from "../../domain/session.devices.service";
import { HttpStatus } from "../../../../core/types/http-statuses";
import { mapToDeviceViewModel } from "../mappers/map-to-devices-view-model";

export async function getAllSessionsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = req.deviceInfo;
    const sessions = await sessionDevicesService.getAllSessions(
      payload!.userId,
    );
    const result = sessions.map(mapToDeviceViewModel);
    res.status(HttpStatus.Ok).send(result);
  } catch (e) {
    next(e);
  }
}
