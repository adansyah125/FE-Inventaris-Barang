// src/components/Dashboard/Dashboard.jsx
import React, { useState } from 'react';

import { MENU_ITEMS, BG_COLOR } from '../../data/constants'; // Hapus PRIMARY_COLOR, MODES jika tidak digunakan
// Pastikan komponen ini sudah diimpor dan path-nya benar:
import Sidebar from '../Layout/Sidebar'; 
import Header from '../Layout/Header'; 
import DashboardContent from './DashboardContent';
import DataIndukContent from './KIB/KibContent';
import LaporanKIRContent from './KIR/LaporanKIRContent';
import PrintLabelsContent from './Label/PrintLabelsContent';
import AddData from './KIB/addData';
import AddDataKir from './KIR/addDataKir';
import UserContent from './User/UserContent';
import Laporan from './Laporan/laporan';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


const Dashboard = ({ initialMenuId = 'dashboard' }) => {

 const [activeMenuId, setActiveMenuId] = useState(initialMenuId);
  
  // 🎯 STATE BARU: Untuk mengontrol visibilitas sidebar di mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

 const handleMenuClick = (id) => {
  setActiveMenuId(id);
 };
  
  // 🎯 FUNGSI BARU: Untuk membuka/menutup sidebar
  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  // 🎯 FUNGSI BARU: Untuk menutup sidebar (dipanggil dari Sidebar.jsx)
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

 const navigate = useNavigate();
 const handleLogout = async () => {
  try {
   await axios.post(
    "http://localhost:8000/api/logout",
    {},
    {
     headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
     },
    }
   );
  } catch (error) {
   console.log("Logout error:", error);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("role");

  toast.success("Berhasil logout!");
  navigate("/");
 };

 const activeMenu = MENU_ITEMS.find((item) => item.id === activeMenuId);
 const activeMenuLabel = activeMenu ? activeMenu.label : 'Dashboard';

 const renderContent = () => {
  switch (activeMenuId) {
   case 'dashboard':
    return <DashboardContent />;
   case 'kib':
    return (
     <DataIndukContent
    
     />
    );
   case 'AddData':
    return <AddData />;
   case 'reports':
    return <LaporanKIRContent />;
   case 'addData':
    return <AddDataKir />;
   case 'print_labels':
    return <PrintLabelsContent />;
   case 'laporan':
    return <Laporan />;
   case 'user':
    return <UserContent />;
      default:
        return <DashboardContent />;
  }
 };

 return (
  <div className={`flex min-h-screen font-sans bg-${BG_COLOR}`}>
   {/* Sidebar disembunyikan saat print */}
   <div className="print:hidden">
 <Sidebar 
          activeMenuId={activeMenuId} 
          onMenuItemClick={handleMenuClick} 
          onLogout={handleLogout} 
          isOpen={isSidebarOpen} // Meneruskan state
          onClose={handleCloseSidebar} // Meneruskan fungsi penutup
        />
   </div>

   <div className="flex-1 flex flex-col">
    {/* Header juga disembunyikan saat print */}
    <div className="print:hidden">
     <Header 
            activeMenuLabel={activeMenuLabel} 
            onToggleSidebar={handleToggleSidebar} // Meneruskan fungsi toggle
          />
    </div>

    {/* main tetap, isi komponen yang atur sendiri apa yang ke-print */}
    <main className="p-8 flex-1">{renderContent()}</main>

    {/* footer juga disembunyikan saat print */}
    <footer className="p-4 text-center text-xs text-gray-500 border-t border-gray-200 print:hidden">
     &copy; 2025 SIMBADA Kecamatan Bandung Kidul. All rights reserved. V1.4.0
    </footer>
   </div>
  </div>
 );
};

export default Dashboard;