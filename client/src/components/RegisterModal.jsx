import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/thunks/authThunk";
import { X } from "lucide-react";

const RegisterModal = ({
    open,
    onClose,
}) => {
    const dispatch = useDispatch();

    const { loading } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            password: "",
        });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e
    ) => {
        e.preventDefault();

        const result =
            await dispatch(
                registerUser(formData)
            );

        if (
            registerUser.fulfilled.match(
                result
            )
        ) {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        Register
                    </h2>

                    <button
                        onClick={onClose}
                        className="
            p-2
            rounded-lg
            hover:bg-gray-100
            transition
        "
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg"
                    >
                        {loading
                            ? "Registering..."
                            : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;