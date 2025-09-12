import {
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createPost,
  createUser,
  deletePost,
  deleteUser,
  getPosts,
  getUsers,
  updatePost,
  updateUser,
  type Post,
  type User,
} from "./api";
import { highlightAndScrollElement, nextTempId } from "./utils";
import toast from "react-hot-toast";

// Post QueryOptions
export function getPostsQueryOptions() {
  return queryOptions({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function getCreatePostMutationOptions(
  queryClient: ReturnType<typeof useQueryClient>
) {
  return mutationOptions({
    mutationFn: createPost,
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({
        queryKey: getPostsQueryOptions().queryKey,
      });

      const prevPosts = queryClient.getQueryData<Post[]>(
        getPostsQueryOptions().queryKey
      );

      const tempId = nextTempId("post");
      const optimisticPost: Post = { id: tempId, ...newPost };

      if (prevPosts) {
        queryClient.setQueryData<Post[]>(getPostsQueryOptions().queryKey, [
          ...prevPosts,
          optimisticPost,
        ]);
      } else {
        queryClient.setQueryData<Post[]>(getPostsQueryOptions().queryKey, [
          optimisticPost,
        ]);
      }

      return { prevPosts, tempId };
    },
    onSuccess: async (serverPost, _vars, context) => {
      const prev = queryClient.getQueryData<Post[]>(["posts"]) ?? [];

      if (context?.tempId != null) {
        queryClient.setQueryData<Post[]>(
          ["posts"],
          prev?.map((p) =>
            p.id === context.tempId ? { ...serverPost, id: context.tempId } : p
          )
        );
        toast.success("Post created successfully ", { id: "create-post" });

        highlightAndScrollElement(context.tempId, "post");
      } else {
        queryClient.setQueryData<Post[]>(["posts"], [...prev, serverPost]);
      }
    },

    onError: (err, _vars, context) => {
      queryClient.setQueryData(["posts"], context?.prevPosts);
      console.error("Error creating post:", err);
      toast.error("Failed to create post");
    },

    onSettled: () => {
      // deliberately do not invalidate because JSONPlaceholder wont persist; keep optimistic item
    },
  });
}

export function getDeletePostMutationOptions(
  queryClient: ReturnType<typeof useQueryClient>
) {
  // Not implemented
  return {
    mutationFn: (id: number) => deletePost(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: getPostsQueryOptions().queryKey,
      });
      const prev = queryClient.getQueryData<Post[]>(["posts"]) ?? [];

      queryClient.setQueryData<Post[]>(
        ["posts"],
        prev.filter((u) => u.id !== id)
      );

      return { prev };
    },
    onSuccess: () => {
      toast.success("Post deleted successfully ");
    },
    onError: (
      _err: Error,
      _vars: unknown,
      context: { prev?: Post[] } | undefined
    ) => {
      if (context?.prev) queryClient.setQueryData(["posts"], context.prev);
      console.error("Error deleting post", _err);
      toast.error("Failed to delete post");
    },
    onSettled: () => {
      // no invalidation
    },
  };
}

export function getUpdatePostMutationOptions(
  queryClient: ReturnType<typeof useQueryClient>
) {
  return {
    mutationFn: (post: Post) =>
      updatePost(post.id, {
        title: post.title,
        body: post.body,
        userId: post.userId,
      }),

    onMutate: async (updatedPost: Post) => {
      await queryClient.cancelQueries({
        queryKey: getPostsQueryOptions().queryKey,
      });

      const prevPosts = queryClient.getQueryData<Post[]>(
        getPostsQueryOptions().queryKey
      );

      if (prevPosts) {
        queryClient.setQueryData<Post[]>(
          getPostsQueryOptions().queryKey,
          prevPosts.map((p) =>
            p.id === updatedPost.id ? { ...p, ...updatedPost } : p
          )
        );
      }

      console.log("Optimistically updated post:", updatedPost);
      return { prevPosts, updatedPost };
    },

    onSuccess: (serverPost: Post) => {
      const prev = queryClient.getQueryData<Post[]>(["posts"]) ?? [];

      if (serverPost) {
        queryClient.setQueryData<Post[]>(
          ["posts"],
          prev.map((p) => (p.id === serverPost.id ? serverPost : p))
        );
      } else {
        // fallback: keep optimistic update in cache
        queryClient.setQueryData<Post[]>(["posts"], prev);
      }
      toast.success("Post updated successfully ");
    },

    onError: (
      err: Error,
      _vars: unknown,
      context: { prevPosts?: Post[] } | undefined
    ) => {
      if (context?.prevPosts) {
        queryClient.setQueryData(
          getPostsQueryOptions().queryKey,
          context.prevPosts
        );
      }
      console.error("Error updating post:", err);
      toast.error("Failed to update post");
    },

    onSettled: () => {
      // no invalidation to prevent JSONPlaceholder overwriting optimistic items
    },
  };
}

// User QueryOptions

export function getUsersQueryOptions() {
  return queryOptions({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    staleTime: 1000 * 60 * 2,
  });
}

export function getCreateUserMutationOptions(
  queryClient: ReturnType<typeof useQueryClient>
) {
  return mutationOptions({
    mutationFn: createUser,
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({
        queryKey: getUsersQueryOptions().queryKey,
      });

      const prevUsers = queryClient.getQueryData<User[]>(
        getUsersQueryOptions().queryKey
      );

      const tempId = nextTempId("user");
      const optimisticUser: User = { id: tempId, ...newUser };

      if (prevUsers) {
        queryClient.setQueryData<User[]>(getUsersQueryOptions().queryKey, [
          ...prevUsers,
          optimisticUser,
        ]);
      } else {
        queryClient.setQueryData<User[]>(getUsersQueryOptions().queryKey, [
          optimisticUser,
        ]);
      }

      return { prevUsers, tempId };
    },
    onSuccess: async (serverUser, _vars, context) => {
      const prev = queryClient.getQueryData<User[]>(["users"]) ?? [];

      if (context?.tempId != null) {
        queryClient.setQueryData<User[]>(
          ["users"],
          prev?.map((p) =>
            p.id === context.tempId ? { ...serverUser, id: context.tempId } : p
          )
        );
        toast.success("User created successfully  ", { id: "create-user" });

        highlightAndScrollElement(context.tempId, "user");
      } else {
        // fallback: append server post if temp not found
        queryClient.setQueryData<User[]>(["users"], [...prev, serverUser]);
      }
    },

    onError: (err, _vars, context) => {
      queryClient.setQueryData(["posts"], context?.prevUsers);
      console.error("Error creating post:", err);
      toast.error("Failed to create post");
    },

    onSettled: () => {
      // deliberately do not invalidate here because JSONPlaceholder won't persist; keep optimistic item
    },
  });
}

export function getUpdateUserMutationOptions(
  queryClient: ReturnType<typeof useQueryClient>
) {
  return {
    mutationFn: (user: User) =>
      updateUser(user.id, {
        name: user.name,
        username: user.username,
        email: user.email,
      }),

    onMutate: async (updatedUser: User) => {
      await queryClient.cancelQueries({
        queryKey: getUsersQueryOptions().queryKey,
      });

      const prevUsers = queryClient.getQueryData<User[]>(
        getUsersQueryOptions().queryKey
      );

      if (prevUsers) {
        queryClient.setQueryData<User[]>(
          getUsersQueryOptions().queryKey,
          prevUsers.map((p) =>
            p.id === updatedUser.id ? { ...p, ...updatedUser } : p
          )
        );
      }

      return { prevUsers, updatedUser };
    },

    onSuccess: (serverUser: User) => {
      const prev = queryClient.getQueryData<User[]>(["users"]) ?? [];

      if (serverUser) {
        queryClient.setQueryData<User[]>(
          ["users"],
          prev.map((p) => (p.id === serverUser.id ? serverUser : p))
        );
      } else {
        // fallback: keep optimistic update in cache
        queryClient.setQueryData<User[]>(["users"], prev);
      }
      toast.success("User updated successfully  ");
    },

    onError: (
      err: Error,
      _vars: unknown,
      context: { prevUsers?: User[] } | undefined
    ) => {
      if (context?.prevUsers) {
        queryClient.setQueryData(
          getUsersQueryOptions().queryKey,
          context.prevUsers
        );
      }
      console.error("Error updating user:", err);
      toast.error("Failed to update user");
    },

    onSettled: () => {
      // no invalidation to prevent JSONPlaceholder overwriting optimistic items
    },
  };
}

export function getDeleteUserMutationOptions(
  queryClient: ReturnType<typeof useQueryClient>
) {
  return {
    mutationFn: (id: number) => deleteUser(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: getUsersQueryOptions().queryKey,
      });
      const prev = queryClient.getQueryData<User[]>(["users"]) ?? [];

      queryClient.setQueryData<User[]>(
        ["users"],
        prev.filter((u) => u.id !== id)
      );

      return { prev };
    },
    onSuccess: () => {
      toast.success("User deleted successfully  ");
    },
    onError: (
      _err: Error,
      _vars: unknown,
      context: { prev?: User[] } | undefined
    ) => {
      if (context?.prev) queryClient.setQueryData(["users"], context.prev);
      console.error("Error deleting user", _err);
      toast.error("Failed to delete user");
    },
    onSettled: () => {
      // no invalidation because of JSONPlaceholder API
    },
  };
}
