interface GetPixData {
    userId: string;
    value: number;
}

class ProfileService {
    private baseURL = "http://localhost:3000";

    private async makeRequest(
        endpoint: string,
        method: "GET" | "POST" | "PATCH" | "DELETE",
        token?: string,
        data?: any
    ) {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

         // ← CORRIGIR: Para GET, não usar body
        const fetchOptions: RequestInit = {
            method,
            headers,
        };

        // ← ADICIONAR BODY APENAS SE NÃO FOR GET
        if (method !== "GET" && data) {
            fetchOptions.body = JSON.stringify(data);
        }

       const response = await fetch(`${this.baseURL}${endpoint}`, fetchOptions);

        return response;
    }

    // ← CORRIGIR: GET PIX com query parameters na URL
    async getPix(data: GetPixData) {
       
         const endpoint = `/pix/get-pix/${data.userId}?value=${data.value}`;
        
        console.log("🔗 Endpoint final:", endpoint);
        
        return this.makeRequest(endpoint, "GET"); // ← GET sem body
    }
}

export const profileService = new ProfileService()

// ← Exportar tipos para uso em outros arquivos
export type {
  GetPixData,
};