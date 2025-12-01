import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [email, setEmail] = useState("");      // ganti dari username
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Simpan token & role user
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      // Redirect sesuai role
        // if (user.role === "admin") {
        //   navigate("/dashboard");
        // } else if (user.role === "kelurahan") {
        //   navigate("/dashboard");
        // } else {
        //   navigate("/dashboard");
        // }

      navigate("/dashboard");
    } catch (err) {
      toast.error("Email atau password salah!");
      console.log(err);
    } 
  };

  return (
    <div className="min-h-screen bg-[#1a1a4f] flex">
      {/* Bagian kiri */}
      <div className="flex-1 flex flex-col justify-center p-12 text-white max-w-xl">
        <img
          src="/logo-kecamatan.png"
          alt="Logo Kecamatan Bandung Kidul"
          className="h-20 mb-6"
        />
        <h1 className="text-3xl font-extrabold mb-3">KECAMATAN BANDUNG KIDUL</h1>
        <p className="text-sm leading-relaxed opacity-80 mb-8 max-w-md">
          Sistem Informasi Manajemen Barang Daerah Terintegrasi.
        </p>
        <p className="text-xs opacity-50">
          Version 3.5.0 (Enterprise Build) <br />
          © 2025 Pemerintah Kota Bandung
        </p>
      </div>

      {/* Form Login */}
      <div className="w-full max-w-md bg-gray-100 p-10 rounded-l-lg shadow-lg flex flex-col justify-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Selamat Datang
        </h2>
        <p className="text-sm text-gray-500 mb-7">
          Silakan masuk untuk mengakses dashboard inventaris.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs text-gray-600 mb-1">
              EMAIL / USERNAME
            </label>
            <div className="relative">
              <input
                type="text"
                id="email"
                placeholder="admin@contoh.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-3 pr-3 py-3 rounded-md border border-gray-300 text-gray-700"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs text-gray-600 mb-1">
              PASSWORD SISTEM
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-3 pr-3 py-3 rounded-md border border-gray-300 text-gray-700"
            />
          </div>

          {/* Error */}
          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 cursor-pointer bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md transition"
          >
            MASUK APLIKASI
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
