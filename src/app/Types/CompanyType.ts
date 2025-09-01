
export interface siteType{
        admin_id:number,
        site_name: string,
        full_address: string,
        post_code: string,
        lat: string,
        long: string,
        company_id?: number
}

export interface companyType{
    admin_id:number;
    company_name:string;
    sector_type:string;
    company_email:string;

    main_site_id?:number;
    company_website?:string;
    comapny_logo?:string;
    company_license?:string;
}


export interface comanypayload{
    admin_id:number;
    company_name:string;
    sector_type:string;
    company_email:string;
    main_site_id?:number;
    company_website?:string;
    comapny_logo?:string;
    company_license?:string;



    sites:siteType[]
}