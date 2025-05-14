import api_url from "@/app/config/api_url"
import { cookies } from 'next/headers';

class Check_Authenticated{ 


   async Protected_page_verify() {

        try{
            // === Get Token From Cookies ==
            const cookieStore = await cookies();
            const token =  cookieStore.get('token')?.value;

            // === Call The End Point To Check the Auth With Cookie Token
            const response  = await fetch(`${api_url.baseUrl}/isAuthenticated`, {
                method: 'GET',
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `token=${token}`, 
                },
            });

            
            // ===  Send The Response To  Dashboard Layout
            const data = await response.json();
            if (response.ok ) {
                return data;
            } else {
                console.error("❌ Auth check failed:", data);
                return { isAuthenticated: false , from :"condition"  }; 
            }

        }catch(e){
            console.error("❌ Error in Protected_page_verify:", e);
            return { isAuthenticated: false , from :"error" };
        }

    }


}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Check_Authenticated();