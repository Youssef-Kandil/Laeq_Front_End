export interface AssetsType{
    id?:number;
    asset_name:string;
    asset_category:string;
    brand:string;
    model:string;
    warranty_date:string;
    last_maintenance_date:string;
    next_maintenance_date:string;
    color:string;
    serial_number:string;
    description:string;
    company_id:number;
    site_id:number;
    admin_id:number;
    asset_img:string | Blob | null;
    file_name?:string

};