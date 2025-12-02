import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const LaporanKIRContent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

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
            ); 
            
            setData(response.data.data); // pastikan response.data berupa array
        } catch (error) {
            console.error('Gagal mengambil data KIR:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, kode_barang) => {
        const result = await Swal.fire({
            title: "Hapus Data?" + kode_barang,
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        });
        if(!result.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8000/api/kir/${id}`, {
                headers: {
                    Authorization : `Bearer ${token}`,
                }
            }); 

            setData((prev) => prev.filter((item) => item.id !== id));
            toast.success("Data KIR" + kode_barang + "berhasil dihapus");
        } catch (error) {
            console.erroe(error);
            toast.err("gagal");
        }
    }

    const filteredData = data.filter((item) => {
    const keyword = search.toLowerCase();

    return (
        item.nama_barang?.toLowerCase().includes(keyword) ||
        item.kode_barang?.toLowerCase().includes(keyword) ||
        item.lokasi_ruangan?.toLowerCase().includes(keyword)
    );
});


    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-gray-100 mb-4">
                <div className="mb-4 md:mb-0">
                    <h1 className="text-4xl font-light text-gray-900 tracking-tight">
                        Data Kartu Inventaris <span className="font-bold text-indigo-600">Ruangan</span>
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

            <div className="flex mb-5">
                <input 
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`Cari data dalam (Nama, Kode Barang, lokasi)...`}
                    className="px-4 py-2 w-full md:w-96 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
                <div className='ml-auto'>
                <Link
                    to="/laporan-kir/tambah"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                    Tambah Data
                </Link>
                </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-50 text-center text-xs font-semibold text-gray-700 uppercase border-b border-gray-300 sticky top-0">
                        <tr>
                            <th className="px-3 py-3 border-r border-gray-200">No</th>
                            <th className="px-3 py-3 border-r border-gray-200">Nama Barang</th>
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
                    <tbody className="text-xs text-center">
                        {loading ? (
                            <tr>
                               <td colSpan="11" className="text-center py-10 bg-white">
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                                        <p className="ml-3 text-sm text-gray-500">Memuat data...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredData.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={item.id} className="bg-white hover:bg-indigo-50 border-b border-gray-100">
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">{index + 1}</td>
                                    <td className="border-r border-gray-100 px-3 py-3">{item.nama_barang}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center font-mono">{item.kode_barang}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">{item.tahun}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center font-semibold">{item.lokasi_ruangan}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">{item.kondisi}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center font-bold">{item.jumlah}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center font-bold">{item.nilai_perolehan}</td>
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
                                            <Link to={`/laporan-kir/edit/${item.id}`} className="text-amber-600 hover:text-amber-800 text-xs">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                            </Link>
                                            <button onClick={() => handleDelete(item.id, item.kode_barang)} className="text-red-600 hover:text-red-800 text-xs cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                            </button>
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
