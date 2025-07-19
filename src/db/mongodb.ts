import { Collection, Db, MongoClient } from "mongodb";
import { Blog } from "../blogs/types/blog";
import { Post } from "../posts/types/post";
import { SETTINGS } from "../core/setting/setting";
import { Comment } from "../comments/types/comment";
import { User } from "../user/domain/user.entity";
import { RequestLog } from "../auth/types/request-log.type";
import { DeviceSessionEntity } from "../security/devices/types/device-session.entity";

const BLOGS_COLLECTION_NAME = "blogs";
const POSTS_COLLECTION_NAME = "posts";
const USERS_COLLECTION_NAME = "users";
const COMMENTS_COLLECTION_NAME = "comments";
const REFRESH_TOKENS_COLLECTION_NAME = "refreshTokens";
const REQUEST_LOG_COLLECTION_NAME = "requestLogs";
const SESSION_DEVICES_COLLECTION_NAME = "sessionDevices";

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<Comment>;
export let requestLogsCollection: Collection<RequestLog>;
export let sessionDevicesCollection: Collection<DeviceSessionEntity>;
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  try {
    await client.connect();
    const db: Db = client.db(SETTINGS.DB_NAME);
    blogCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
    postCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
    userCollection = db.collection<User>(USERS_COLLECTION_NAME);
    commentCollection = db.collection<Comment>(COMMENTS_COLLECTION_NAME);
    requestLogsCollection = db.collection<RequestLog>(
      REQUEST_LOG_COLLECTION_NAME,
    );
    sessionDevicesCollection = db.collection(SESSION_DEVICES_COLLECTION_NAME);
    await db.command({ ping: 1 });
    console.log("✅ Connected to the database");
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

// для тестов
export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}
