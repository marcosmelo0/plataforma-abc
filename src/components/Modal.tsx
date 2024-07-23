interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                <h2 className="text-lg font-semibold mb-4">Erro de Autenticação</h2>
                <p className="text-gray-700">Email ou senha incorretos.</p>
                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;