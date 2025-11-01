import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "../lib/ApiService";
import { AssetsType } from "../Types/AssetsType"; 

const api = new ApiService();

// === Add New Asset ===
// export const useAddAsset = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: AssetsType) =>
//       api.post("/add_new_asset", payload).then((res) => res),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["assets"] });
//     },
//   });
// };

// export const useAddNewAsset = () => {
//     return useMutation({
//       mutationFn: async (asset: AssetsType) => {
//         const formData = new FormData();
  
//         let meta = { ...asset };
  
//         if (asset.asset_img && asset.asset_img instanceof Blob) {
//           const fileKey = `asset_img`;
//           formData.append(fileKey, asset.asset_img, `asset.webp`);
//           meta = { ...asset, asset_img: fileKey };
//         }
  
//         formData.append("meta", JSON.stringify(meta));
  
//         const res = await api.postFormData("/add_new_asset", formData);
//         return res;
//       },
  
//       onError: (error) => {
//         console.error("Error adding asset:", error);
//       },
//     });
// };


export const useAddNewAsset = () => {
  return useMutation({
    mutationFn: async (asset: AssetsType) => {
      const formData = new FormData();
      let meta = { ...asset };

      try {
        if (asset.asset_img) {
          // ✅ الحالة 1: لو الصورة Blob أو File
          if (
            typeof asset.asset_img !== "string" &&
            (asset.asset_img instanceof Blob ||
              (asset.asset_img as Blob).type?.startsWith("image/"))
          ) {
            formData.append("asset_img", asset.asset_img, "asset.webp");
            meta = { ...asset, asset_img: "asset_img" };
          }

          // ✅ الحالة 2: لو الصورة Base64
          else if (
            typeof asset.asset_img === "string" &&
            asset.asset_img.startsWith("data:image")
          ) {
            const blob = await fetch(asset.asset_img).then((r) => r.blob());
            formData.append("asset_img", blob, "asset.webp");
            meta = { ...asset, asset_img: "asset_img" };
          }

          // ✅ الحالة 3: لو الصورة URL عادي (مش محتاجة رفع)
          else if (typeof asset.asset_img === "string") {
            meta = { ...asset, asset_img: asset.asset_img };
          }
        }

        // ✅ باقي البيانات
        formData.append("meta", JSON.stringify(meta));

        const res = await api.postFormData("/add_new_asset", formData);
        return res;
      } catch (err) {
        console.error("❌ Error adding asset:", err);
        throw err;
      }
    },

    onError: (error) => {
      console.error("❌ Error adding asset:", error);
    },
  });
};

// === Fetch Assets By Admin ID ===
export const useAssetsByAdmin = (admin_id: number) => {
  return useQuery({
    queryKey: ["assets", "admin", admin_id],
    queryFn: () =>
      api.post("/get_all_assets_by_admin_id", { admin_id }).then((res) => res),
    enabled: !!admin_id,
  });
};

// === Fetch Asset Data By Asset ID ===
export const useAssetsData = (id: number) => {
  return useQuery({
    queryKey: ["assets", "admin", id],
    queryFn: () =>
      api.post("/get_assets_data_by_id", { id }).then((res) => res),
    enabled: !!id,
  });
};

// === Update Asset ===
export const useUpdateAsset = () => {

  return useMutation({
    mutationFn: async (asset: AssetsType) => {
      const formData = new FormData();
  
      let meta = { ...asset };
  
      if (asset.asset_img && asset.asset_img instanceof Blob) {
        const fileKey = `asset_img`;
        formData.append(fileKey, asset.asset_img, `asset.webp`);
        meta = { ...asset, asset_img: fileKey };
      }
  
      formData.append("meta", JSON.stringify(meta));
  
      const res = await api.updateFormData("/update_asset", formData);
      return res;
    },
  
    onError: (error) => {
      console.error("Error adding asset:", error);
    },
  });
};



// === Delete Asset ===
export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: number ,ImageFileName:string}) =>
      api.delete("/delete_asset", payload).then((res) => res),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
};
