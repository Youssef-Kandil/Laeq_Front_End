/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { ClientOnlyTable } from "@/app/components/global/Table/Table";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";
import { useAssetsByAdmin, useDeleteAsset } from "@/app/Hooks/useAssets";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import SkeletonLoader from "@/app/components/global/SkeletonLoader/SkeletonLoaders";
import { FaRegEye } from "react-icons/fa";
import Popup from '@/app/components/global/Popup/Popup';





function Assets() {
  const router = useRouter();
  const current_lang = useLocale();

  // Get logged in user info
  const info = getAdminAccountInfo("AccountInfo");
  const isEmployee = info?.role === "employee";
  const targetId = isEmployee ? info?.userDetails?.admin_id : info?.userDetails?.id;
   // حالة البوباب التأكيدي للحذف
  const [confirmDeletePopup, setConfirmDeletePopup] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState<any | null>(null);

  // Fetch assets
  const {
    data: assetsData,
    isLoading,
    isError,
  } = useAssetsByAdmin(targetId ?? -1); 

  // Delete hook
  const { mutate: deleteAsset } = useDeleteAsset();

  React.useEffect(() => {
    localStorage.setItem("clickedAsideTitle", "assets");
  }, []);

  const local_var = "assets.tb_headers";

  // === Loading / Error States ===
  if (isLoading) return <SkeletonLoader />;
  if (isError) return <p className="text-red-500">❌ Error loading assets</p>;

  // === Modify Data for Table ===
  const modifiedData =
    assetsData?.map((asset: any) => ({
      name: asset.asset_name || "—",
      model: asset.model || "—",
      category: asset.asset_category || "—",
      brand: asset.brand || "—",
      warranty: asset.warranty_date || "—",
      company: asset.companies.company_name || "—",
      site: asset.sites.site_name || "—",
      delete_action: (
        <button
          className="p-2 hover:text-red-600"
          onClick={()=>{
            setSelectedAsset(asset);
            setConfirmDeletePopup(true);
          }} 
        >
          <LuTrash2 style={{ fontSize: 20 }} />
        </button>
      ),
      edit_action: (
        <button
          className="p-2 hover:text-blue-600"
          onClick={() =>
            router.push(
              `/${current_lang}/laeq-admin/dashboard/assets/EditAssetForm/${asset.id}`
            )
          }
        >
          <FiEdit2 style={{ fontSize: 20 }} />
        </button>
      ),
      show_action: (
        <button
          className="p-2 hover:text-blue-600"
          onClick={() =>
            router.push(
              `/${current_lang}/laeq-admin/dashboard/assets/ShowAssetDetails/${asset.id}`
            )
          }
        >
          <FaRegEye style={{ fontSize: 20 }} />
        </button>
      ),
    })) || [];

  return (
    <div>

      {/* بوباب تأكيد الحذف */}
      {confirmDeletePopup && (
      <Popup
        icon={<LuTrash2 style={{ color: "red" }} />}
        title="Are you sure you want to delete?"
        subTitle="when you delete this Asset you cannot be undone."
        btnTitle="Yes, delete"
        btnFunc={() => {
          if (selectedAsset) {
            deleteAsset({ id: selectedAsset.id,ImageFileName:selectedAsset?.asset_img??"" })
          }
          setConfirmDeletePopup(false);
          setSelectedAsset(null);
        }}
        onClose={() => {
          setConfirmDeletePopup(false);
          setSelectedAsset(null);
        }}
      />
    )}
      <ClientOnlyTable
        titles={[
          `${local_var}.name`,
          `${local_var}.model`,
          `${local_var}.category`,
          `${local_var}.brand`,
          `${local_var}.warranty`,
          `${local_var}.company`,
          `${local_var}.site`,
          "",
          "",
          "",
        ]}
        data={modifiedData}
        rowsFlex={[1, 1, 1, 1, 1, 1, 1, 0.4, 0.4,0.4]}
        navButtonTitle="assets"
        navButtonAction={() =>
          router.push(
            `/${current_lang}/laeq-admin/dashboard/assets/AddAssetForm`
          )
        }
      />
    </div>
  );
}

export default Assets;
