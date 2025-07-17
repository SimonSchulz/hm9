import { addSeconds } from "date-fns";

export class DeviceSessionEntity {
  deviceId: string;
  userId: string;
  ip: string;
  title: string;
  lastActiveDate: string;
  expiresAt: string;

  constructor(ip: string, title: string, userId: string, deviceId: string) {
    this.deviceId = deviceId;
    this.userId = userId;
    this.ip = ip;
    this.title = title;
    const now = new Date();
    this.lastActiveDate = now.toISOString();
    this.expiresAt = addSeconds(now, 20).toISOString();
  }
}
