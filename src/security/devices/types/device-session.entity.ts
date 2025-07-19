import { addSeconds } from "date-fns";

export class DeviceSessionEntity {
  deviceId: string;
  userId: string;
  ip: string;
  title: string;
  iat: string;
  expiresAt: string;

  constructor(
    ip: string,
    title: string,
    userId: string,
    deviceId: string,
    iat: string,
  ) {
    this.deviceId = deviceId;
    this.userId = userId;
    this.ip = ip;
    this.title = title;
    this.iat = iat;
    const date = new Date(iat);
    this.expiresAt = addSeconds(date, 20).toISOString();
  }
}
