import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { LoginDto } from "../../dto/login.dto";
import { authService } from "../../domain/auth.service";
import { AuthorizationError } from "../../../core/utils/app-response-errors";
import { LoginSuccessViewModel } from "../../types/login-success-view-model";
import { sessionDevicesService } from "../../../security/devices/domain/session.devices.service";
import { jwtService } from "../../domain/jwt.service";

export async function authLoginHandler(
  req: Request<{}, {}, LoginDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { loginOrEmail, password } = req.body;
    const tokens = await authService.loginUser(loginOrEmail, password);
    if (!tokens) {
      throw new AuthorizationError("Wrong credentials");
    }
    const { accessToken, refreshToken } = tokens;
    const ip = req.ip as string;
    const title: string =
      req.headers?.["user-agent"]?.toString() || loginOrEmail;
    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) throw new AuthorizationError();
    const refreshIat = jwtService.getTokenIssuedAt(refreshToken);
    await sessionDevicesService.createSession(
      ip,
      title,
      payload.userId,
      payload.deviceId,
      refreshIat.toISOString(),
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(HttpStatus.Ok).send({ accessToken } as LoginSuccessViewModel);
  } catch (e: unknown) {
    next(e);
  }
}
