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

    const count = await requestLogsCollection.countDocuments({
      ip,
      url,
      date: { $gte: tenSecondsAgo },
    });
    if (count >= 5) {
      return res.status(HttpStatus.TooManyRequests).send("Too many requests");
    }
    await requestLogsCollection.insertOne({ ip, url, date: now });
    next();
  } catch (error) {
    next();
  }
};
