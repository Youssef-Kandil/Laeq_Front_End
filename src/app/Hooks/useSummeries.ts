import {useQuery} from "@tanstack/react-query";
import ApiService from "../lib/ApiService";


const api = new ApiService();


// === GET Roles ===
export const useSummeries = (admin_id: number) => {
  return useQuery({
    queryKey: ["summeries", admin_id],
    queryFn: () =>
      api.post("/get_all_report_summeries_by_admin", { admin_id })
         .then(res => res),
    enabled: !!admin_id
  });
};
