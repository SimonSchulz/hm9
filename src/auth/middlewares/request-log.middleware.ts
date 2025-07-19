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
    const url = req.originalUrl; // используем originalUrl!
    const key = `${ip}:${url}`;

    const now = Date.now();
    const tenSecondsAgo = now - 10_000;

    const previous = requestsMap.get(key) || [];
    const recent = previous.filter((ts) => ts >= tenSecondsAgo);

    if (recent.length >= 5) {
      return res.sendStatus(HttpStatus.TooManyRequests); // 429
    }

    recent.push(now);
    requestsMap.set(key, recent);
    next();
  } catch (err) {
    next(err);
  }
};
