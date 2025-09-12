import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCreateUserMutationOptions,
  getDeleteUserMutationOptions,
  getUpdateUserMutationOptions,
  getUsersQueryOptions,
} from "../lib/queries";
import { useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import { RxPencil1, RxPlus, RxTrash } from "react-icons/rx";
import type { User } from "../lib/api";
import Loading from "../components/ui/Loading";
import { useEffect, useState } from "react";
import Table from "../components/ui/Table";
import Modal from "../components/ui/Modal";

type UserFormValues = {
  id: number;
  name: string;
  username: string;
  email: string;
};

const UsersPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const {
    data: users = [],
    isPending,
    isError: usersError,
    error: usersErrorData,
  } = useQuery(getUsersQueryOptions());

  const { mutateAsync: createUserMutation } = useMutation(
    getCreateUserMutationOptions(queryClient)
  );

  const { mutateAsync: updateUserMutation } = useMutation(
    getUpdateUserMutationOptions(queryClient)
  );

  const { mutateAsync: deleteUserMutation } = useMutation(
    getDeleteUserMutationOptions(queryClient)
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    defaultValues: {
      id: "" as unknown as number,
      name: "",
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    if (editingUser) {
      reset({
        id: editingUser.id || users[0]?.id || 1,
        name: editingUser.name,
        username: editingUser.username,
        email: editingUser.email,
      });
    } else {
      reset({ id: "" as unknown as number, name: "", username: "", email: "" });
    }
  }, [editingUser, reset, users]);

  useEffect(() => {
    document.title = `Users`;
  }, []);

  const onSubmit = async (vals: UserFormValues) => {
    if (editingUser) {
      await updateUserMutation({ ...editingUser, ...vals });
      closeForm();
      return;
    }

    await createUserMutation(vals);
    closeForm();
  };

  const handleDeleteUser = async () => {
    if (deletingUserId == null) return;
    try {
      await deleteUserMutation(deletingUserId);
      setDeletingUserId(null);
    } catch (e) {
      setDeletingUserId(null);
      console.error(e);
    }
  };

  const openCreateForm = () => {
    setEditingUser(null);
    reset({ name: "", username: "", email: "" });
    setIsFormOpen(true);
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingUser(null);
    setIsFormOpen(false);
    reset();
  };

  const confirmDelete = (id: number) => {
    console.log("confirm delete");
    setDeletingUserId(id);
  };

  if (isPending) return <Loading></Loading>;
  if (usersError) return <div>Error: {usersErrorData.message}</div>;

  const headers: (keyof User)[] = ["id", "name", "username", "email"];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Users</h1>
        <div className="flex gap-2">
          <Button onClick={openCreateForm}>
            <RxPlus />
            New User
          </Button>
        </div>
      </div>

      <Table
        headers={headers}
        rows={users}
        rowIdPrefix="user"
        actions={(user) => (
          <div className="flex flex-col lg:flex-row gap-2">
            <Button onClick={() => openEditForm(user)} kind="edit">
              <RxPencil1 size={"1.3em"} />
              <span>Edit</span>
            </Button>
            <Button kind="delete" onClick={() => confirmDelete(user.id)}>
              <RxTrash size={"1.3em"} />
              <span>Delete</span>
            </Button>
          </div>
        )}
      />

      {isFormOpen && (
        <Modal isOpen={isFormOpen} onClose={closeForm}>
          <h2 className="text-lg font-bold mb-4">
            {editingUser ? "Edit User" : "Create User"}
          </h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label className="block mb-1 text-sm font-medium">Name</label>

              <input
                type="text"
                placeholder="Name"
                className="input w-full text-neutral  dark:text-white "
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Username</label>

              <input
                type="text"
                placeholder="User Name"
                className="input w-full text-neutral  dark:text-white "
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>

              <input
                type="email"
                placeholder="Email"
                className="input w-full text-neutral  dark:text-white "
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button kind="delete" onClick={() => closeForm()}>
                Cancel
              </Button>
              <Button type="submit" kind="primary" disabled={isSubmitting}>
                {editingUser ? "Save" : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm modal */}
      {deletingUserId != null && (
        <Modal
          isOpen={deletingUserId != null}
          onClose={() => setDeletingUserId(null)}
        >
          <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete user {deletingUserId}?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button kind="delete" onClick={() => setDeletingUserId(null)}>
              Cancel
            </Button>
            <Button kind="primary" onClick={handleDeleteUser}>
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;
