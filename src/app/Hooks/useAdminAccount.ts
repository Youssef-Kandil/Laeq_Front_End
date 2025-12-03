import { useMutation, QueryClient } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";
import { AdminAccountPayload ,updateAdminAccountPayload } from '../Types/AccountsType';

const api = new ApiService();
const queryClient = new QueryClient();



export const useAdminAccount = () => {
  return useMutation({
    mutationFn: (payload: AdminAccountPayload) =>
      api.post("/create_admin_account", payload).then((res) => res),
    onSuccess: (data) => {
      // خزّن الداتا في الكاش
      queryClient.setQueryData(["adminAccountInfo"], data);
    },
  });
};

export const useEditAdminAccount = () => {
  return useMutation({
    mutationFn: (payload: updateAdminAccountPayload) =>
      api.update("/edit_admin_account", payload).then((res) => res),
    onSuccess: (data) => {
      // خزّن الداتا في الكاش
      queryClient.setQueryData(["adminAccountInfo"], data);
    },
  });
};

export const useGoogleAdminAccount = () => {
  return useMutation({
    mutationFn: (payload: AdminAccountPayload) =>
      api.post("/create_admin_account_with_google", payload).then((res) => res),
    onSuccess: (data) => {
      // خزّن الداتا في الكاش
      queryClient.setQueryData(["adminAccountInfo"], data);
    },
  });
};