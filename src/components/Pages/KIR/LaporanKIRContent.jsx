import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LaporanKIRContent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/kir', 
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
            ); // endpoint API Laravel
            
            setData(response.data.data); // pastikan response.data berupa array
        } catch (error) {
            console.error('Gagal mengambil data KIR:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-gray-100 mb-4">
                <div className="mb-4 md:mb-0">
                    <h1 className="text-4xl font-light text-gray-900 tracking-tight">
                        Data Aset <span className="font-bold text-indigo-600">Laporan</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">Kelola data aset inventaris negara (KIB/KIR).</p>
                </div>
                <div className="flex flex-wrap space-x-3">
                    <button onClick={() => console.log('Export Excel')}>
                        <span className="mr-2 text-lg">⬇️</span> Export Excel Data
                    </button>
                    <button onClick={() => console.log('Export PDF')}>
                        <span className="mr-2 text-lg">📄</span> Export PDF Dokumen
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <input 
                    type="text"
                    placeholder={`Cari data dalam (Nama, Kode, Kategori ABC)...`}
                    className="px-4 py-2 w-full md:w-96 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
            </div>

            <div className='mb-5'>
                <Link
                    to="/laporan-kir/tambah"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                    Tambah Data
                </Link>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-50 text-center text-xs font-semibold text-gray-700 uppercase border-b border-gray-300 sticky top-0">
                        <tr>
                            <th className="px-3 py-3 border-r border-gray-200">No</th>
                            <th className="px-3 py-3 border-r border-gray-200">Nama Barang</th>
                            <th className="px-3 py-3 border-r border-gray-200">Merek/Tipe</th>
                            <th className="px-3 py-3 border-r border-gray-200">Kode Barang</th> 
                            <th className="px-3 py-3 border-r border-gray-200">Tahun</th>
                            <th className="px-3 py-3 border-r border-gray-200">Lokasi (Ruangan)</th>
                            <th className="px-3 py-3 border-r border-gray-200">Kondisi</th> 
                            <th className="px-3 py-3 border-r border-gray-200">Jumlah</th> 
                            <th className="px-3 py-3 border-r border-gray-200">Nilai Perolehan</th>
                            <th className="px-3 py-3 border-r border-gray-200 bg-indigo-50 text-indigo-700">QR Code</th>
                            <th className="px-3 py-3 bg-gray-100">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {loading ? (
                            <tr>
                                <td colSpan="11" className="text-center py-10 text-gray-500 italic bg-white">
                                    Loading data...
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={item.id} className="bg-white hover:bg-indigo-50 border-b border-gray-100">
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">{index + 1}</td>
                                    <td className="border-r border-gray-100 px-3 py-3">{item.nama_barang}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">{item.merk}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center font-mono">{item.kode_barang}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">{item.tahun}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center font-semibold">{item.lokasi_ruangan}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">{item.kondisi}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center font-bold">{item.jumlah}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-right font-bold">{item.nilai_perolehan}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">
                                        
                                        <div className="inline-flex flex-col items-center">
                                            {item.gambar_qr ? (
                                                <img src={item.gambar_qr} alt="QR Code" className="w-12 h-12" />
                                            ) : (
                                                <div className="w-12 h-12 border border-dashed border-gray-300 rounded-md flex items-center justify-center text-[9px] text-gray-400">
                                                    QR
                                                </div>
                                            )}
                                            {console.log(item.gambar_qr)}
                                            <span className="mt-1 text-[10px] text-gray-400">Scan Label</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button className="text-blue-600 hover:text-blue-800 text-xs">Edit</button>
                                            <button className="text-red-600 hover:text-red-800 text-xs">Hapus</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center py-10 text-gray-500 italic bg-white">
                                    Tidak ada data KIR yang cocok.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default LaporanKIRContent;
