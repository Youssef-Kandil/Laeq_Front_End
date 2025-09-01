import { useQuery,useQueryClient,useMutation} from "@tanstack/react-query";
import ApiService from "../lib/ApiService";
import { comanypayload } from "../Types/CompanyType";


const api = new ApiService();

// === GET All User Company By User ID ===
export const useGetCompaniesByUserId = (admin_id: number) => {
  return useQuery({
    queryKey: ["companies", admin_id], 
    queryFn: () => api.post("/get_all_user_companies", { admin_id }),
    enabled: !!admin_id, 
    select: (res) => res
  });
};

// === CREATE NEW COMPANY BY ADMIN ID ===
export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCompany: comanypayload) =>
      api.post("/add_new_company", newCompany),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] }); // تحديث القائمة
    },
  });
};

