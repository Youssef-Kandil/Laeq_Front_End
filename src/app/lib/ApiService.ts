import api_url from "@/app/config/api_url";

export default class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = api_url.baseUrl;
  }

  private async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // توكن لو موجود
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }

  public get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  public post(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  public update(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  public delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  }
}
