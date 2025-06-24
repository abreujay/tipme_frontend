/* eslint-disable @typescript-eslint/no-explicit-any */
export const RegisterUser = {
    create: async (userData: any) => {
        try {
            // Lógica para criar um novo usuário
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao criar usuário");
            }

            return data;
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error;
        }
    }
}