import { useQuery } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";

const api = new ApiService();

// === GET Check lists ===
export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => api.get("/get_all_permissions"),
  });
};
