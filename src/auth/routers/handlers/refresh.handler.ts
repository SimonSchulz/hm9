import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { LoginSuccessViewModel } from "../../types/LoginSuccessViewModel";
import { SETTINGS } from "../../../core/setting/setting";
import { refreshService } from "../../domain/refresh.token.service";
import { AuthorizationError } from "../../../core/utils/app-response-errors";
import { refreshTokenRepository } from "../../Repositories/refresh.token.repo";

export async function refreshTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      throw new AuthorizationError("No refresh token provided");
    }
    const isBlacklisted =
      await refreshTokenRepository.isTokenInvalidated(oldRefreshToken);
    if (isBlacklisted) {
      throw new AuthorizationError("Refresh token not found or already used");
    }

    const tokens = await refreshService.refreshToken(oldRefreshToken);

    res
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: Number(SETTINGS.RF_TIME) * 1000,
      })
      .status(HttpStatus.Ok)
      .send({ accessToken: tokens.accessToken } as LoginSuccessViewModel);
  } catch (error) {
    next(error);
  }
}
