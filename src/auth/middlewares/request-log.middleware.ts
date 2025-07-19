import { Request, Response, NextFunction } from "express";
import { requestLogsCollection } from "../../db/mongodb";
import { HttpStatus } from "../../core/types/http-statuses";

export const requestLogMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ip = req.ip?.toString() || "";
    const url = req.originalUrl;
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10 * 1000);
    await requestLogsCollection.insertOne({ ip, url, date: now });
    const count = await requestLogsCollection.countDocuments({
      ip,
      url,
      date: { $gte: tenSecondsAgo },
    });
    if (count > 5) {
      res.sendStatus(HttpStatus.TooManyRequests);
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};
