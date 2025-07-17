import { Request, Response, NextFunction } from 'express';
import { requestLogsCollection } from '../../db/mongodb';

export const requestLogMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ip = req.ip?.toString() ||'';
        const url = req.originalUrl;
        const now = new Date();
        const tenSecondsAgo = new Date(now.getTime() - 10 * 1000);

        await requestLogsCollection.insertOne({ ip, url, date: now });

        const count = await requestLogsCollection.countDocuments({
            ip,
            url,
            date: { $gte: tenSecondsAgo },
        });
        next();
    } catch (error) {
        console.error(error);
        next();
    }
};
