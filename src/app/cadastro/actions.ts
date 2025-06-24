import { RegisterUser } from "@/shared/service";

export default function CadastrarUsuario (formData: FormData) {

    const userData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    };

    // Aqui você pode chamar a função de registro do usuário
    // Exemplo:
     return RegisterUser.create(userData);

}