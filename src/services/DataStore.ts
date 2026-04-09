import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { Like } from "../models/Like";
import { Follow } from "../models/Follow";
import { Feed } from "../models/Feed";
import { Notification } from "../models/Notification";
import { Message } from "../models/Message";

export class DataStore {
    public static users: Map<string, User> = new Map();
    public static profiles: Map<string, Profile> = new Map();
    public static posts: Map<string, Post> = new Map();
    public static comments: Map<string, Comment> = new Map();
    public static likes: Map<string, Like> = new Map();
    public static followers: Map<string, Follow> = new Map();
    public static feeds: Map<string, Feed> = new Map();
    public static notifications: Map<string, Notification> = new Map();
    public static messages: Map<string, Message> = new Map();
}
