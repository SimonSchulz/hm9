import { DeviceSessionEntity } from "../types/device-session.entity";
import { sessionDevicesCollection } from "../../../db/mongodb";
import { WithId } from "mongodb";

export const SessionDevicesRepository = {
  async findAllByUserId(
    userId: string,
  ): Promise<WithId<DeviceSessionEntity>[]> {
    return sessionDevicesCollection.find({ userId }).toArray();
  },

  async create(
    sessionDevice: DeviceSessionEntity,
  ): Promise<DeviceSessionEntity> {
    await sessionDevicesCollection.insertOne(sessionDevice);
    return sessionDevice;
  },

  async deleteAllExcept(userId: string, deviceIdToKeep: string): Promise<void> {
    await sessionDevicesCollection.deleteMany({
      userId,
      deviceId: { $ne: deviceIdToKeep },
    });
  },

  async deleteByDeviceId(userId: string, deviceId: string): Promise<boolean> {
    const result = await sessionDevicesCollection.deleteOne({
      userId,
      deviceId,
    });
    return result.deletedCount === 1;
  },
};
