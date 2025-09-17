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

  public post(endpoint: string, body: unknown) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  public update(endpoint: string, body: unknown) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  public delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  }
    // === New: POST multipart/form-data ===
  public postFormData(endpoint: string, formData: FormData) {
      return fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        body: formData, // 👈 نخلي البودي هو الـ FormData مباشرة
        // مفيش content-type هنا، المتصفح هيحددها تلقائي
      }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      });
    }
}
