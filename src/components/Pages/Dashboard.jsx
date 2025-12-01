// src/components/Dashboard/Dashboard.jsx
import React, { useState } from 'react';

import { MENU_ITEMS, BG_COLOR, PRIMARY_COLOR, MODES } from '../../data/constants';

import Sidebar from '../Layout/Sidebar';
import Header from '../Layout/Header';
import DashboardContent from './DashboardContent';
import DataIndukContent from './KIB/KibContent';
import LaporanKIRContent from './KIR/LaporanKIRContent';
import PrintLabelsContent from './Label/PrintLabelsContent';
import AddData from './KIB/addData';
import AddDataKir from './KIR/addDataKir';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import UserContent from './User/UserContent';

// Data awal digabung (contoh KIB + KIR)
const initialDataItems = [
  // Contoh KIB A
  {
    id: 1,
    jenis: 'KIB',
    sub_jenis: 'Tanah',
    kib_type: 'A',
    kode: '1.01.01.01.001',
    nama: 'Tanah Kantor Utama',
    noreg: '001/T',
    merk: '-',
    lokasi: 'Jl. Sudirman No. 12',
    jumlah: 1,
    satuan: 'Bidang',
    nilai: 'Rp 900.000.000',
    nilaiNumerik: 900000000,
    tahun: 2018,
    asal_usul: 'Pembelian',
    kondisi: 'Baik',
    kategori_abc: 'A',
  },
  // Contoh KIB B
  {
    id: 2,
    jenis: 'KIB',
    sub_jenis: 'Mesin',
    kib_type: 'B',
    kode: '1.03.01.02.001',
    nama: 'Mobil Dinas Sedan',
    noreg: '001/A',
    merk: 'Toyota Camry',
    lokasi: 'Kantor Utama',
    jumlah: 1,
    satuan: 'Unit',
    nilai: 'Rp 450.000.000',
    nilaiNumerik: 450000000,
    tahun: 2020,
    kondisi: 'Baik',
    kategori_abc: 'B',
    no_seri_pabrik: 'PBRK001',
    // nanti bisa ada qr_payload dari input KIR/KIB
    // qr_payload: 'https://domain/barcode?payload=....'
  },
  // Contoh KIR (inventaris ruangan)
  {
    id: 5,
    jenis: 'KIR',
    sub_jenis: '-',
    kib_type: null,
    kode: '1.03.02.05.005',
    nama: 'Kursi Staf Putar',
    noreg: '003/C',
    merk: 'IKEA MARKUS',
    lokasi: 'Ruang Staf',
    jumlah: 10,
    satuan: 'Buah',
    nilai: 'Rp 12.000.000',
    nilaiNumerik: 12000000,
    tahun: 2021,
    kondisi: 'Baik',
    kategori_abc: 'C',
    // qr_payload: 'https://domain/barcode?payload=....',
    // foto_barang_base64: 'data:image/...'
  },
];

const Dashboard = ({ initialMenuId = 'dashboard' }) => {
  // satu sumber data untuk seluruh aplikasi
  const [dataItems, setDataItems] = useState(initialDataItems);
  const [activeMenuId, setActiveMenuId] = useState(initialMenuId);

  

  const handleMenuClick = (id) => {
    setActiveMenuId(id);
  };

  const navigate = useNavigate();
    const handleLogout = async () => {
    try {
      // kirim ke API logout (HARUS pakai token)
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      console.log("Logout error:", error);
    }

    // apapun responnya, hapus token
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // redirect ke halaman login
    toast.success("Berhasil logout!");
    navigate("/");
  };

  const activeMenu = MENU_ITEMS.find((item) => item.id === activeMenuId);
  const activeMenuLabel = activeMenu ? activeMenu.label : 'Dashboard';

  const renderContent = () => {
    switch (activeMenuId) {
      case 'dashboard':
        return <DashboardContent dataItems={dataItems} />;

      case 'kib':
        return (
          <DataIndukContent
            dataItems={dataItems}
          />
        );
      case'AddData':
        return <AddData dataItems={dataItems} />;
      case 'reports':
        return <LaporanKIRContent dataItems={dataItems} />;
      case 'addDataKir':
        return <AddDataKir dataItems={dataItems} />;
      case 'print_labels':
        // PrintLabelsContent nerima semua dataItems
        return <PrintLabelsContent dataItems={dataItems} />;

      case 'user':
         return <UserContent dataItems={dataItems} />;
    }
  };

  return (
    <div className={`flex min-h-screen font-sans bg-${BG_COLOR}`}>
      {/* Sidebar disembunyikan saat print */}
      <div className="print:hidden">
        <Sidebar activeMenuId={activeMenuId} onMenuItemClick={handleMenuClick} onLogout={handleLogout} />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header juga disembunyikan saat print */}
        <div className="print:hidden">
          <Header activeMenuLabel={activeMenuLabel} />
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
