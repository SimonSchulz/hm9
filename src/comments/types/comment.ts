import { RequestDataEntity } from "../../core/types/request-data.entity";

export type Comment = {
  content: string;
  commentatorInfo: RequestDataEntity;
  createdAt: string;
  postId: string;
};
