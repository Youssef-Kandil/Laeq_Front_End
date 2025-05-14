import api_url from "@/app/config/api_url"

class SignupService{ 

   async createAcount(email: string, password: string, full_name :string , phone:string): Promise<object|undefined> {
        try{
            const response  = fetch(`${api_url.baseUrl}/create_admin_account`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password ,full_name, phone ,register_with_google:"0"}),
            });

            if ((await response).ok) {
                const data = await (await response).json();
                console.log("Created Acount Successful",data);
                return data;
            } else {
                console.error("Created Acount failed");
                return (await response).json();
            }

        }catch(e){
            console.error("Created Acountfailed", e);
        }

    }

   async createAcountWithGoolge(email: string, provider: string): Promise<object|undefined> {
        try{
            const response  = fetch(`${api_url.baseUrl}/login_with_google`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, provider }),
            });

            if ((await response).ok) {
                const data = await (await response).json();
                console.log("Login successful",data);
                return data;
            } else {
                console.error("Login failed");
                return (await response).json();
            }

        }catch(e){
            console.error("Login failed", e);
        }

    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new SignupService();