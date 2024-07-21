import { Header } from "./Header"

export function Login () {
    return (
    <>
      <Header />
      <div className="flex items-center pb-[15vh] justify-center min-h-screen bg-gray-600">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 mx-4">
          <h2 className="text-2xl font-bold text-center mb-6">Entrar</h2>
          <form>
            <div className="mb-4 text-base">
              <label className="block text-gray-700" htmlFor="username">Email</label>
              <input
                type="text"
                id="username"
                className="w-full p-2 border border-gray-300 rounded outline-blue-600"
                placeholder="Seu email..."
                required
                />
            </div>
            <div className="mb-6 text-base">
              <label className="block text-gray-700 " htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded outline-blue-600"
                placeholder="Sua senha"
                required
                />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </>
    );
  }