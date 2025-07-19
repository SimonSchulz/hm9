import { DeviceSessionEntity } from "../types/device-session.entity";
import { sessionDevicesCollection } from "../../../db/mongodb";
import { WithId } from "mongodb";

export const SessionDevicesQueryRepository = {
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
};
