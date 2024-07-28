import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabase";
import { Header } from "../components/Header";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";

// Definindo o esquema Zod para validação do formulário
const formSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório."),
    email: z.string().email("Email inválido."),
    password: z.string().min(6, "A senha deve conter pelo menos 6 caracteres.").max(120, "A senha não pode ter mais de 120 caracteres."),
    role: z.enum(["user", "admin"], { message: "Role deve ser 'user' ou 'admin'." })
});

// Tipo inferido do esquema Zod
type FormValues = z.infer<typeof formSchema>;

export function Register() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "user" // Default role
        }
    });

    const onSubmit = async (values: FormValues) => {
        try {
            const { email, password, name, role } = values;

            // Registra o usuário no Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password
            });

            if (authError) throw authError;

            if (authData.user) {
                // Salva dados adicionais do perfil do usuário na tabela 'user_profiles'
                const { error: dbError } = await supabase
                    .from('user_profiles')
                    .upsert({ id: authData.user.id, name, is_super_admin: role === "admin" });

                if (dbError) throw dbError;

                Swal.fire({
                    title: 'Ebaa..',
                    text: 'Aluno cadastrado!',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'blue',
                    timerProgressBar: true,
                    timer: 3000,
                });

                setTimeout(() => {
                    window.location.href = '/'
                }, 3000);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Register error", error);
            Swal.fire({
                title: 'Ops..',
                text: error.message || 'Erro ao cadastrar!',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: 'blue',
                timerProgressBar: true,
                timer: 3000,
            });
        }
    };

    return (
        <>
            <Header />
            <div className="flex items-center pb-[15vh] justify-center min-h-screen bg-gray-600">
                <div className="bg-white p-8 rounded-lg shadow-md w-96 mx-4 text-gray-700">
                    <h2 className="text-2xl font-bold text-center mb-6">Cadastrar</h2>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mb-4 text-base">
                            <label className="block text-gray-700" htmlFor="name">Nome</label>
                            <input
                                type="text"
                                id="name"
                                {...form.register("name")}
                                className="w-full p-2 border border-gray-300 text-gray-600 rounded outline-blue-600"
                                placeholder="Seu nome..."
                            />
                            {form.formState.errors.name && (
                                <span className="text-red-500 text-sm">{form.formState.errors.name.message}</span>
                            )}
                        </div>
                        <div className="mb-4 text-base">
                            <label className="block text-gray-700" htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                {...form.register("email")}
                                className="w-full p-2 border border-gray-300 text-gray-600 rounded outline-blue-600"
                                placeholder="Seu email..."
                            />
                            {form.formState.errors.email && (
                                <span className="text-red-500 text-sm">{form.formState.errors.email.message}</span>
                            )}
                        </div>
                        <div className="mb-6 text-base">
                            <label className="block text-gray-700" htmlFor="password">Senha</label>
                            <input
                                type="password"
                                id="password"
                                {...form.register("password")}
                                className="w-full p-2 border border-gray-300 text-gray-600 rounded outline-blue-600"
                                placeholder="Sua senha"
                            />
                            {form.formState.errors.password && (
                                <span className="text-red-500 text-sm">{form.formState.errors.password.message}</span>
                            )}
                        </div>
                        <div className="mb-4 text-base">
                            <label className="block text-gray-700" htmlFor="role">Tipo de Usuário</label>
                            <select
                                id="role"
                                {...form.register("role")}
                                className="w-full p-2 border border-gray-300 text-gray-600 rounded outline-blue-600"
                            >
                                <option value="user">Usuário</option>
                                <option value="admin">Admin</option>
                            </select>
                            {form.formState.errors.role && (
                                <span className="text-red-500 text-sm">{form.formState.errors.role.message}</span>
                            )}
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
                            Criar Conta
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
