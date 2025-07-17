import { NextFunction, Request, Response } from "express";
import { AuthorizationError } from "../../../../core/utils/app-response-errors";
import { sessionDevicesService } from "../../domain/session.devices.service";
import { jwtService } from "../../../../auth/domain/jwt.service";
import { HttpStatus } from "../../../../core/types/http-statuses";

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
    res.status(HttpStatus.Ok).send(sessions);
  } catch (e) {
    next(e);
  }
}
