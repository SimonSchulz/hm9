import { WithId } from "mongodb";
import { DeviceViewModel } from "../../types/device-view-model";
export function mapToDeviceViewModel(
  data: WithId<DeviceViewModel>,
): DeviceViewModel {
  return {
    ip: data.ip,
    title: data.title,
    lastActiveDate: data.lastActiveDate,
    deviceId: data.deviceId,
  };
}
