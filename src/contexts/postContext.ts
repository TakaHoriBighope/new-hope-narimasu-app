import { createContext } from "react";
import { type Post } from "../types/post";

type PostsContextValue = {
  posts: Post[];
  setPosts: (post: Post[]) => void;
};

export const PostsContext = createContext<PostsContextValue>({
  posts: [],
  setPosts: () => {},
});
