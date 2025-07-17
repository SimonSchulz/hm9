import { RequestDataEntity } from "../../core/types/request-data.entity";

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: RequestDataEntity;
  createdAt: string;
};
