import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../core/types/http-statuses";

const requestsMap = new Map<string, number[]>();

export const requestLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ip = req.ip || "";
    const url = req.baseUrl + req.path;
    const key = `${ip}:${url}`;

    const now = Date.now();
    const tenSecondsAgo = now - 10_000;

    const timestamps = requestsMap.get(key) || [];

    const recentTimestamps = timestamps.filter((ts) => ts >= tenSecondsAgo);

    if (recentTimestamps.length >= 5) {
      return res.sendStatus(HttpStatus.TooManyRequests); // 429
    }
    recentTimestamps.push(now);
    requestsMap.set(key, recentTimestamps);
    next();
  } catch (error) {
    next(error);
  }
};
