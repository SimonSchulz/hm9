import { DeviceSessionEntity } from "../types/device-session.entity";
import { sessionDevicesCollection } from "../../../db/mongodb";
import { WithId } from "mongodb";

export const SessionDevicesRepository = {
  async findAllByUserId(
    userId: string,
  ): Promise<WithId<DeviceSessionEntity>[]> {
    return sessionDevicesCollection.find({ userId }).toArray();
  },
  async findSessionByDeviceId(
    deviceId: string,
  ): Promise<WithId<DeviceSessionEntity> | null> {
    return sessionDevicesCollection.findOne({ deviceId });
  },

  async create(
    sessionDevice: DeviceSessionEntity,
  ): Promise<DeviceSessionEntity> {
    await sessionDevicesCollection.insertOne(sessionDevice);
    return sessionDevice;
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
