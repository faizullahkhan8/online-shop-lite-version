import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";
import { toast } from "react-toastify";

/* =========================================================
   API Functions (Private)
========================================================= */

const registerUserApi = async (user) => {
    const { data } = await apiClient.post("/users/register", user);
    return data;
};

const loginUserApi = async (user) => {
    const { data } = await apiClient.post("/users/login", user);
    return data;
};

const logoutUserApi = async () => {
    const { data } = await apiClient.post("/users/logout");
    return data;
};

const updateUserApi = async ({ userId, user }) => {
    const { data } = await apiClient.put(`/users/update/${userId}`, user, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

/* =========================================================
   Mutations
========================================================= */

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: registerUserApi,
        onSuccess: (data) => {
            toast.success("User registered successfully");
            return data;
        },
        onError: (error) => {
            const message =
                error?.response?.data?.message || "Something went wrong";
            toast.error(message);
            console.log("Error in Register User", error);
        },
    });
};

export const useLoginUser = () => {
    return useMutation({
        mutationFn: loginUserApi,
        onSuccess: (data) => {
            toast.success("User logged in successfully");
            return data;
        },
        onError: (error) => {
            const message =
                error?.response?.data?.message || "Something went wrong";
            toast.error(message);
            console.log("Error in Login User", error);
        },
    });
};

export const useLogoutUser = () => {
    return useMutation({
        mutationFn: logoutUserApi,
        onSuccess: (data) => {
            toast.success("User logged out successfully");
            return data;
        },
        onError: (error) => {
            const message =
                error?.response?.data?.message || "Something went wrong";
            toast.error(message);
            console.log("Error in Logout User", error);
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUserApi,
        onSuccess: (data) => {
            toast.success("User updated successfully");
            // optionally invalidate user-related queries
            queryClient.invalidateQueries({ queryKey: ["users"] });
            return data;
        },
        onError: (error) => {
            const message =
                error?.response?.data?.message || "Something went wrong";
            toast.error(message);
            console.log("Error in Update User", error);
        },
    });
};
