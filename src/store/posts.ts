import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { Post } from '../types';

interface PostState {
  postIds: string[];
  postsById: Record<string, Post>;
  setPosts: (posts: Post[]) => void;
}

const usePostStore = create<PostState>()(
  persist(
    devtools((set) => ({
      postIds: [],
      postsById: {},
      setPosts: (posts: Post[]) =>
        set(() => ({
          postIds: posts.map((item) => item.id),
          postsById: posts.reduce((acc, post) => {
            acc[post.id] = post;
            return acc;
          }, {} as Record<string, Post>),
        })),
    })),
    {
      name: 'posts',
      getStorage: () => sessionStorage,
    }
  )
);

export default usePostStore;
