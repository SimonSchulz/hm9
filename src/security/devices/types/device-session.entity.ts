import { addSeconds } from 'date-fns';

export class DeviceSessionEntity {
    deviceId: string;
    userId: string;
    ip: string;
    title: string;
    lastActiveDate: string;
    expiresAt: string;

    constructor(data: {
        deviceId: string;
        userId: string;
        ip: string;
        title: string;
    }) {
        this.deviceId = data.deviceId;
        this.userId = data.userId;
        this.ip = data.ip;
        this.title = data.title;
        const now = new Date();
        this.lastActiveDate = now.toISOString();
        this.expiresAt =  addSeconds(now, 20).toISOString();
    }
}