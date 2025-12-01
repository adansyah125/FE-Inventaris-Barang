import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const KirDetail = () => {
  const { id } = useParams();
  const [kir, setKir] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKir();
  }, []);

  const fetchKir = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/kir/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setKir(response.data.data);
    } catch (error) {
      console.error('Gagal mengambil data KIR:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading...</p>;
  if (!kir) return <p className="p-8 text-center text-red-500">Data tidak ditemukan.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Detail KIR</h1>
        <div className="space-y-3">
          <div><strong>Nama Barang:</strong> {kir.nama_barang}</div>
          <div><strong>Merek/Tipe:</strong> {kir.merk}</div>
          <div><strong>Kode Barang:</strong> {kir.kode_barang}</div>
          <div><strong>Tahun:</strong> {kir.tahun}</div>
          <div><strong>Lokasi:</strong> {kir.lokasi_ruangan}</div>
          <div><strong>Kondisi:</strong> {kir.kondisi}</div>
          <div><strong>Jumlah:</strong> {kir.jumlah}</div>
          <div><strong>Nilai Perolehan:</strong> {kir.nilai_perolehan}</div>
          <div className="text-center mt-4">
            {kir.gambar_qr ? (
              <img src={kir.gambar_qr} alt="QR Code" className="w-32 h-32 mx-auto" />
            ) : (
              <div className="w-32 h-32 border border-dashed border-gray-300 flex items-center justify-center mx-auto">
                QR
              </div>
            )}
          </div>
          <div className="mt-4">
            <strong>Keterangan:</strong>
            <p>{kir.keterangan || '-'}</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/laporan-kir"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Kembali ke Laporan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KirDetail;
