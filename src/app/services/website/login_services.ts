import api_url from "@/app/config/api_url"

class LoginService{ 

   async login(email: string, password: string): Promise<object|undefined> {
        try{
            const response  = fetch(`${api_url.baseUrl}/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
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

   async Goolge_login(email: string, provider: string): Promise<object|undefined> {
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
export default new LoginService();