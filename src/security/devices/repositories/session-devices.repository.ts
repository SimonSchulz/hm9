import { DeviceSessionEntity } from "../types/device-session.entity";
import { sessionDevicesCollection } from "../../../db/mongodb";

export const SessionDevicesRepository = {
  async create(
    sessionDevice: DeviceSessionEntity,
  ): Promise<DeviceSessionEntity> {
    await sessionDevicesCollection.insertOne(sessionDevice);
    return sessionDevice;
  },
  async updateLastActiveDate(deviceId: string, iat: string) {
    await sessionDevicesCollection.updateOne(
      { deviceId },
      { $set: { lastActiveDate: iat } },
    );
  },
  async deleteAllExcept(userId: string, deviceId: string): Promise<void> {
    await sessionDevicesCollection.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  },

  async deleteByDeviceId(deviceId: string): Promise<boolean> {
    const result = await sessionDevicesCollection.deleteOne({
      deviceId,
    });
    return result.deletedCount === 1;
  },
};
