import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Laporan() {
  const [data, setData] = useState([]);
  const [loading , setLoading ] = useState(true);

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/get/kondisi", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      // Ubah object ke array agar bisa di-loop di table
      setData(Object.entries(res.data.data));
      setLoading(false);
    } catch (err) {
      console.log("error : ", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Hitung total keseluruhan
  const totalBaik = data.reduce((sum, [, nilai]) => sum + nilai.baik, 0);
  const totalRusak = data.reduce((sum, [, nilai]) => sum + nilai["rusak berat"], 0);
  const totalSemua = totalBaik + totalRusak;

  // Handle laporan barang
  const handleDownloadPDF = () => {
  axios.post(
    "http://localhost:8000/api/laporan-barang",
    {}, // body kosong (atau isi data kalau perlu)
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      responseType: "blob", // WAJIB agar bisa download PDF
    }
  )
  .then((res) => {
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Inventaris-barang.pdf";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  })
  .catch(() => toast.error("Gagal mengunduh PDF"));
};
  // Handle Kondisi barang
  const handleDownloadPDFKondisi = () => {
  axios.post(
    "http://localhost:8000/api/kondisi",
    {}, // body kosong (atau isi data kalau perlu)
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      responseType: "blob", // WAJIB agar bisa download PDF
    }
  )
  .then((res) => {
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "kondisi-barang.pdf";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  })
  .catch(() => toast.error("Gagal mengunduh PDF"));
};

  // Handle Kondisi barang baik
  const handleDownloadPDFBaik = () => {
  axios.post(
    "http://localhost:8000/api/kondisi-baik",
    {}, // body kosong (atau isi data kalau perlu)
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      responseType: "blob", // WAJIB agar bisa download PDF
    }
  )
  .then((res) => {
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Kondisi-baik.pdf";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  })
  .catch(() => toast.error("Gagal mengunduh PDF"));
};
  // Handle Kondisi barang rusak
  const handleDownloadPDFRusak = () => {
  axios.post(
    "http://localhost:8000/api/kondisi-rusak",
    {}, // body kosong (atau isi data kalau perlu)
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      responseType: "blob", // WAJIB agar bisa download PDF
    }
  )
  .then((res) => {
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Kondisi-rusak.pdf";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  })
  .catch(() => toast.error("Gagal mengunduh PDF"));
};


  return (
    <div className="p-4 md:p-0 bg-gray-50 min-h-screen">
     
      {/* === Bagian Kartu dan Tombol Cetak === */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-10 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Opsi Cetak Laporan
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={handleDownloadPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition">
            
            <i className="fas fa-print mr-2"></i> Cetak Data Barang Inventaris (Semua)
          </button>

          <button onClick={handleDownloadPDFKondisi} className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition">
            <i className="fas fa-check-circle mr-2"></i> Cetak Kondisi Baik dan Rusak
          </button>

          <button onClick={handleDownloadPDFBaik} className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition">
            <i className="fas fa-exclamation-triangle mr-2"></i> Cetak Kondisi Barang Baik
          </button>

          <button onClick={handleDownloadPDFRusak} className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition">
            <i className="fas fa-times-circle mr-2"></i> Cetak Kondisi Barang Rusak
          </button>
        </div>
      </div>

      {/* === Bagian Laporan Resmi === */}
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-300">
        
        {/* Header Laporan */}
        <div className="flex flex-col md:flex-row items-center justify-center text-center pb-4 mb-6">
          <div className="h-20 w-20 overflow-hidden mb-4 md:mb-0 md:mr-6">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-20 h-20 rounded-full object-cover"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/40x40/ffffff/1a1a4f?text=BK"; 
              }}
            />
          </div>

          <div>
            <p className="text-xs text-gray-600">KEMENTERIAN/LEMBAGA REPUBLIK INDONESIA</p>
            <h2 className="text-2xl font-extrabold text-blue-900 mt-1 mb-1">
              LAPORAN INVENTARIS ASET NEGARA
            </h2>
            <p className="text-sm text-gray-500">
              Periode: 1 Januari 2025 - 31 Desember 2025
            </p>
          </div>
        </div>

        {/* Tabel Laporan */}
       <div className="overflow-x-auto relative">
  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">

    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r">No.</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r">Jenis Barang Inventaris</th>
        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r">Jumlah Total</th>
        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r">Kondisi Baik</th>
        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Kondisi Rusak</th>
      </tr>
    </thead>

    <tbody className="bg-white divide-y divide-gray-200">

      {/* Loading */}
      {loading && (
       <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        <p className="ml-3 text-sm text-gray-500">
                          Memuat data...
                        </p>
                      </div>
                    </td>
                  </tr>
      )}

      {/* Data */}
      {!loading && data.map(([tipe, nilai], index) => (
        <tr key={tipe} className="hover:bg-gray-50">
          <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r">
            {index + 1}
          </td>

          <td className="px-6 py-4 text-sm text-gray-700 border-r capitalize">
            {tipe}
          </td>

          <td className="px-6 py-4 text-sm text-gray-700 text-center border-r">
            {nilai.baik + nilai["rusak berat"]}
          </td>

          <td className="px-6 py-4 text-sm font-semibold text-green-600 text-center border-r">
            {nilai.baik}
          </td>

          <td className="px-6 py-4 text-sm font-semibold text-red-600 text-center">
            {nilai["rusak berat"]}
          </td>
        </tr>
      ))}
    </tbody>

    {!loading && (
      <tfoot>
        <tr className="bg-gray-50">
          <td colSpan="2" className="px-6 py-4 text-sm font-medium text-gray-900 border-r text-center">
            Total
          </td>
          <td className="px-6 py-4 text-sm font-semibold text-center border-r">
            {totalSemua}
          </td>
          <td className="px-6 py-4 text-sm font-semibold text-green-600 text-center border-r">
            {totalBaik}
          </td>
          <td className="px-6 py-4 text-sm font-semibold text-red-600 text-center">
            {totalRusak}
          </td>
        </tr>
      </tfoot>
    )}
  </table>
</div>


        {/* Tanda Tangan */}
        {/* <div className="mt-8 flex justify-end">
          <div className="text-sm text-gray-700 text-center">
            <p className="mb-1">
              Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-semibold mb-16">Kepala Divisi Aset,</p>
            <p className="font-bold border-b border-gray-400 inline-block px-8 mb-1">(Nama Pejabat)</p>
            <p className="text-xs">NIP: [Nomor Induk Pegawai]</p>
          </div>
        </div> */}

      </div>
    </div>
  );
}

export default Laporan;
