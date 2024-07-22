import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabase";
import { Header } from "./Header";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    email: z.string().email("Email inválido."),
    password: z.string().min(6, "A senha deve conter pelo menos 6 caracteres.").max(120, "A senha não pode ter mais de 120 caracteres.")
});

export function Register() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { email, password } = values;
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;

            window.location.replace('/')
        } catch (error) {
            console.log("Register", error);
        }
    };

    return (
        <>
            <Header />
            <div className="flex items-center pb-[15vh] justify-center min-h-screen bg-gray-600">
                <div className="bg-white p-8 rounded-lg shadow-md w-96 mx-4">
                    <h2 className="text-2xl font-bold text-center mb-6">Entrar</h2>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mb-4 text-base">
                            <label className="block text-gray-700" htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                {...form.register("email")}
                                className="w-full p-2 border border-gray-300 rounded outline-blue-600"
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
                                className="w-full p-2 border border-gray-300 rounded outline-blue-600"
                                placeholder="Sua senha"
                            />
                            {form.formState.errors.password && (
                                <span className="text-red-500 text-sm">{form.formState.errors.password.message}</span>
                            )}
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            Criar Conta
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
