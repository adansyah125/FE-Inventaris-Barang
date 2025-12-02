// File: src/components/Layout/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MENU_ITEMS } from '../../data/constants';

const Sidebar = ({ activeMenuId, onMenuItemClick, onLogout }) => {
  const navigate = useNavigate();

  const handleClick = (item) => {
    onMenuItemClick && onMenuItemClick(item.id);

    switch (item.id) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'kib':
        navigate('/data-induk');
        break;
      case 'reports':
        navigate('/laporan-kir');
        break;
      case 'print_labels':
        navigate('/label');
        break;
      case 'user':
        navigate('/user');
        break;
      case 'AddData':
        navigate('data-induk/tambah');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="bg-[#12154c] text-white w-56 h-full flex flex-col justify-between py-6 px-4 shadow-xl">
      {/* BAGIAN ATAS: LOGO + MENU */}
      <div>
        {/* Logo / Judul Aplikasi */}
        <div className="mb-2 px-2 m-auto">
           <img
                    src="logo.png" // Placeholder: Logo Putih
                    alt="Logo Bandung Kidul"
                    className="w-20 h-20 rounded-full object-cover m-auto"
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = "https://placehold.co/40x40/ffffff/1a1a4f?text=BK"; // Fallback ke Teks jika gambar gagal
                    }}
                />
          <p className="text-xs font-semibold text-indigo-200 mt-1 uppercase  tracking-wide">
            Simbada Bandung Kidul
          </p>
        </div>
        <p>-----------------------------</p>

        {/* Menu */}
        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = item.id === activeMenuId;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-white text-[#12154c]'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* BAGIAN BAWAH: LOGOUT */}
      <div className="border-t border-white/10 pt-4 mt-4">
    <button
      onClick={onLogout}
      className="w-full cursor-pointer flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
    >
      <span className="mr-2">🚪</span>
      <span>Keluar Sistem</span>
    </button>
    <p className="mt-2 text-[10px] text-indigo-200 text-center">
      Anda login sebagai Administrator
    </p>
  </div>
</div>
  );
};

export default Sidebar;
