import {useQuery} from "@tanstack/react-query";
import ApiService from "../lib/ApiService";


const api = new ApiService();


// === GET Roles ===
export const useSubscripe = () => {
  return useQuery({
    queryKey: ["subscripe"],
    queryFn: () =>
      api.get(`/get_all_subscriptions`)
         .then(res => res),
  });
};
export const useGetInvoceDetails = (id:number) => {
  return useQuery({
    queryKey: ["subscripe",id],
    queryFn: () =>
      api.post(`/get_invoice`,{id})
         .then(res => res),
  });
};