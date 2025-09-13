import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCreatePostMutationOptions,
  getDeletePostMutationOptions,
  getPostsQueryOptions,
  getUpdatePostMutationOptions,
  getUsersQueryOptions,
} from "../lib/queries";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { type Post, type User } from "../lib/api";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { RxPencil1, RxPlus, RxTrash } from "react-icons/rx";
import Loading from "../components/ui/Loading";

type PostFormValues = {
  title: string;
  body?: string;
  userId: number;
};

const PostsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const {
    data: posts,
    isPending,
    isError,
    error,
  } = useQuery(getPostsQueryOptions());

  const { mutateAsync: createPostMutation } = useMutation(
    getCreatePostMutationOptions(queryClient)
  );

  const { mutateAsync: deletePostMutation } = useMutation(
    getDeletePostMutationOptions(queryClient)
  );

  const { mutateAsync: updatePostMutation } = useMutation(
    getUpdatePostMutationOptions(queryClient)
  );

  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery(getUsersQueryOptions());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    defaultValues: { title: "", body: "", userId: users[0]?.id ?? 1 },
  });

  useEffect(() => {
    if (editingPost) {
      reset({
        title: editingPost.title,
        body: editingPost.body ?? "",
        userId: editingPost.userId || users[0]?.id || 1,
      });
    } else {
      reset({ title: "", body: "", userId: users[0]?.id || 1 });
    }
  }, [editingPost, users, reset]);

  useEffect(() => {
    document.title = "Posts";
  }, []);

  const userMap = useMemo(() => {
    if (!users) return {};
    return users.reduce((acc: Record<number, string>, u: User) => {
      acc[u.id] = u.name;
      return acc;
    }, {});
  }, [users]);

  const onSubmit = async (vals: PostFormValues) => {
    if (editingPost) {
      await updatePostMutation({ ...editingPost, ...vals });
      closeForm();
      return;
    }

    await createPostMutation(vals);

    closeForm();
  };

  const handleDeletePost = async () => {
    if (deletingPostId == null) return;
    try {
      await deletePostMutation(deletingPostId);
      setDeletingPostId(null);
    } catch (e) {
      setDeletingPostId(null);
      console.error(e);
    }
  };

  const openCreateForm = () => {
    setEditingPost(null);
    reset({ title: "", body: "", userId: null as unknown as number });
    setIsFormOpen(true);
  };

  const openEditForm = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingPost(null);
    setIsFormOpen(false);
    reset();
  };

  const confirmDelete = (id: number) => {
    setDeletingPostId(id);
  };

  const displayPosts = useMemo(() => {
    if (!posts) return [];
    return posts.map((p) => ({
      id: p.id,
      title: p.title,
      body: p.body,
      user: userMap[p.userId] ?? String(p.userId),
      userId: p.userId,
    }));
  }, [posts, userMap]);

  if (isPending || usersLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div role="alert" className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error! {error.message}</span>
      </div>
    );
  }

  if (usersError) {
    return (
      <div role="alert" className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error loading users</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Posts</h1>
        <div className="flex gap-2">
          <Button onClick={openCreateForm}>
            <RxPlus />
            New Post
          </Button>
        </div>
      </div>

      <Table<Post & { user: string }>
        headers={["user", "id", "title"]}
        rows={displayPosts}
        rowIdPrefix="post"
        actions={(post) => (
          <div className="flex flex-col lg:flex-row gap-2">
            <Button onClick={() => openEditForm(post)} kind="edit">
              <RxPencil1 size={"1.3em"} />
              <span>Edit</span>
            </Button>
            <Button kind="delete" onClick={() => confirmDelete(post.id)}>
              <RxTrash size={"1.3em"} />
              <span>Delete</span>
            </Button>
          </div>
        )}
      />

      {/* Post form modal */}
      {isFormOpen && (
        <Modal isOpen={isFormOpen} onClose={closeForm}>
          <h2 className="text-lg font-bold mb-4">
            {editingPost ? "Edit Post" : "Create Post"}
          </h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label className="block mb-1 text-sm font-medium">Title</label>

              <input
                type="text"
                placeholder="Title"
                className="input w-full text-neutral  dark:text-white "
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Body</label>
              <textarea
                placeholder="Body: optional"
                className="textarea w-full text-neutral dark:text-white "
                {...register("body")}
              ></textarea>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">User</label>

              <select
                className="select w-full text-neutral  dark:text-white "
                {...register("userId", {
                  valueAsNumber: true,
                  required: "User is required",
                })}
              >
                {!editingPost && <option value="">Select User</option>}
                {Object.entries(userMap).map(([id, name]) => (
                  <option key={id} value={Number(id)}>
                    {name}
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.userId.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button kind="delete" onClick={() => closeForm()}>
                Cancel
              </Button>
              <Button type="submit" kind="primary" disabled={isSubmitting}>
                {editingPost ? "Save" : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm modal */}
      {deletingPostId != null && (
        <Modal
          isOpen={deletingPostId != null}
          onClose={() => setDeletingPostId(null)}
        >
          <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete post {deletingPostId}?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button kind="delete" onClick={() => setDeletingPostId(null)}>
              Cancel
            </Button>
            <Button kind="primary" onClick={handleDeletePost}>
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PostsPage;
