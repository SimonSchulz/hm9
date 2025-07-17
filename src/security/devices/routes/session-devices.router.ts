import { Router } from "express";
import { getAllSessionsHandler } from "./handlers/get-all-sessions.handler";
import { deleteDevicesByIdHandler } from "./handlers/delete-devices-by-id.handler";
import { deleteOtherSessionsHandler } from "./handlers/delete-other-devices.handler";
import { refreshTokenGuard } from "../../../auth/routers/guards/refresh.token.guard";

export const sessionDevicesRouter = Router();

sessionDevicesRouter.get("/", refreshTokenGuard, getAllSessionsHandler);
sessionDevicesRouter.delete("/", refreshTokenGuard, deleteOtherSessionsHandler);
sessionDevicesRouter.delete(
  "/:deviceId",
  refreshTokenGuard,
  deleteDevicesByIdHandler,
);
