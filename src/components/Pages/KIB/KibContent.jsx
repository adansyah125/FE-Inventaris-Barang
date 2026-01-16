import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const DataIndukContent = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [openImport, setOpenImport] = useState(false);
const [fileName, setFileName] = useState("");


    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/kib", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setData(res.data.data);
            setLoading(false);
        } catch (err) {
            console.log("ERROR:", err);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID').format(value);
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

            await axios.delete(`http://localhost:8000/api/kib/${id}`, {
                headers: {
                    Authorization : `Bearer ${token}`,
                }
            });

            setData((prev) => prev.filter((item) => item.id !== id));
            toast.success("Data KIB" + kode_barang + "berhasil dihapus");
        } catch (error) {
            console.erroe(error);
            toast.err("gagal");
        }
    }

    // Filter berdasarkan KIB
    const filteredData = data
    .filter((item) => {
        if (filter === "all") return true;
        if (filter === "A") return item.type_kib === "tanah";
        if (filter === "B") return item.type_kib === "mesin";
        if (filter === "C") return item.type_kib === "gedung";
        return true;
    })
    .filter((item) => {
        if (search.trim() === "") return true;

        const keyword = search.toLowerCase();

        return (
            item.nama_barang?.toLowerCase().includes(keyword) ||
            item.kode_barang?.toLowerCase().includes(keyword) ||
            item.type_kib?.toLowerCase().includes(keyword)
        );
    });


    




    return (
         <>
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-gray-100 mb-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-light text-gray-900 tracking-tight">
                        Data Kartu Inventaris <span className="font-bold text-indigo-600">Barang</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Kelola data aset inventaris negara (KIB/KIR).
                    </p>
                </div>
            </div>

            {/* FILTER */}
            <div className="relative mb-4 border-b border-gray-200 pb-2 overflow-hidden">
                <div className="flex items-center gap-3 md:gap-6 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                        { key: "A", label: "🌱 A", fullLabel: "🌱 KIB A (Tanah)" },
                        { key: "B", label: "🔩 B", fullLabel: "🔩 KIB B (Mesin)" },
                        { key: "C", label: "🏗️ C", fullLabel: "🏗️ KIB C (Gedung)" },
                        { key: "all", label: "🔍 All", fullLabel: "🔍 Semua" },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setFilter(item.key)}
                            className={`
                                relative pb-2 text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0
                                ${filter === item.key ? "text-indigo-600" : "text-gray-600"}
                                hover:text-indigo-500
                            `}
                        >
                            <span className="md:hidden">{item.label}</span>
                            <span className="hidden md:inline">{item.fullLabel}</span>

                            {filter === item.key && (
                                <motion.span
                                    layoutId="underline"
                                    className="absolute left-0 bottom-[2px] h-[2px] bg-indigo-600 w-full rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* SEARCH & ADD */}
           <div className="flex flex-col md:flex-row gap-3 mb-6">
    <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari data (Nama, Kode, Kategori)..."
        className="px-4 py-2 w-full md:w-96 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
    />

    <div className="flex gap-2">
        <button
            onClick={() => setOpenImport(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 transition whitespace-nowrap"
        >
            📥 Import Excel
        </button>

        <Link
            to="/data-induk/tambah"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition whitespace-nowrap"
        >
            + Tambah Data
        </Link>
    </div>
</div>



            {/* TABLE - Desktop View */}
            <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-50 text-center text-xs font-semibold text-gray-700 uppercase border-b border-gray-300 sticky top-0">
                        {(filter === "A" || filter === "B" || filter === "C") ? (
                            <>
                                <tr>
                                    <th rowSpan="2" className="border-r px-3 py-3 border-gray-200">NUP</th>
                                    <th rowSpan="2" className="border-r px-3 py-3 border-gray-200">Nama Barang</th>
                                    <th rowSpan="2" className="border-r px-3 py-3 border-gray-200">No Reg</th>
                                    <th rowSpan="2" className="border-r px-3 py-3 border-gray-200">Spesifikasi</th>
                                    <th rowSpan="2" className="border-r px-3 py-3 border-gray-200">Jumlah</th>
                                    <th rowSpan="2" className="border-r px-3 py-3 border-gray-200">Harga Satuan</th>
                                    <th rowSpan="2" className="border-r px-3 py-3 border-gray-200">Nilai Perolehan</th>

                                    {filter === "A" && <th colSpan="3" className="border-r px-3 py-3 border-gray-200">KIB A</th>}
                                    {filter === "B" && <th colSpan="3" className="border-r px-3 py-3 border-gray-200">KIB B</th>}
                                    {filter === "C" && <th colSpan="3" className="border-r px-3 py-3 border-gray-200">KIB C</th>}

                                    <th rowSpan="2" className="px-3 py-3">Aksi</th>
                                </tr>
                                <tr>
                                    {filter === "A" && (
                                        <>
                                            <th className="border-r px-3 py-3 border-gray-200">Ukuran</th>
                                            <th className="border-r px-3 py-3 border-gray-200">Status Tanah</th>
                                            <th className="border-r px-3 py-3 border-gray-200">No Sertifikat</th>
                                        </>
                                    )}
                                    {filter === "B" && (
                                        <>
                                            <th className="border-r px-3 py-3 border-gray-200">No Rangka</th>
                                            <th className="border-r px-3 py-3 border-gray-200">No Mesin</th>
                                            <th className="border-r px-3 py-3 border-gray-200">No Pabrik</th>
                                        </>
                                    )}
                                    {filter === "C" && (
                                        <>
                                            <th className="border-r px-3 py-3 border-gray-200">Kontruksi</th>
                                            <th className="border-r px-3 py-3 border-gray-200">Luas Lantai</th>
                                            <th className="border-r px-3 py-3 border-gray-200">No Dokumen</th>
                                        </>
                                    )}
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <th className="border-r px-3 py-3 border-gray-200">NUP</th>
                                <th className="border-r px-3 py-3 border-gray-200">Nama Barang</th>
                                <th className="border-r px-3 py-3 border-gray-200">No Reg</th>
                                <th className="border-r px-3 py-3 border-gray-200">Spesifikasi</th>
                                <th className="border-r px-3 py-3 border-gray-200">Jumlah</th>
                                <th className="border-r px-3 py-3 border-gray-200">Lokasi</th>
                                <th className="border-r px-3 py-3 border-gray-200">Harga Satuan</th>
                                <th className="border-r px-3 py-3 border-gray-200">Nilai Perolehan</th>
                                <th className="px-3 py-3">Aksi</th>
                            </tr>
                        )}
                    </thead>

                    <tbody className="text-xs">
                        {loading ? (
                            <tr>
                                <td colSpan={filter === "all" ? "8" : "11"} className="text-center py-10 bg-white">
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                                        <p className="ml-3 text-sm text-gray-500">Memuat data...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredData.length === 0 && search.trim() !== "" ? (
                            <tr>
                                <td colSpan="11" className="text-center py-10 text-gray-500 italic bg-white">
                                    {search.trim() !== "" ? `❌ Data tidak ditemukan untuk "${search}"` : "Tidak ada data KIR yang cocok."}
                                </td>
                            </tr>
                        ) : filteredData.length === 0 && search.trim() === "" ? (
                            <tr>
                                <td colSpan={filter === "all" ? "8" : "11"} className="text-center py-10 text-gray-500 italic bg-white">
                                    Belum ada data KIB yang tersedia.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item) => (
                                <tr key={item.id} className="bg-white text-center hover:bg-indigo-50">
                                    <td className="bg-gray-100 px-3 py-3 text-center">{item.kode_barang}</td>
                                    <td className="bg-gray-100 px-3 py-3">{item.nama_barang}</td>
                                    <td className="bg-gray-100 px-3 py-3 text-center">{item.no_register}</td>
                                    <td className="bg-gray-100 px-3 py-3">{item.spesifikasi}</td>
                                    <td className="bg-gray-100 px-3 py-3 text-center">{item.jumlah}</td>
                                    <td className="bg-gray-100 px-3 py-3 text-center">
                                         <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                item.lokasi === 'aula'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'

                                            }`}
                                        >
                                            {item.lokasi}
                                        </span>
                                    </td>
                                    <td className="bg-gray-100 px-3 py-3 text-right">Rp. {formatCurrency(item.harga_satuan)}</td>
                                    <td className="bg-gray-100 px-3 py-3 text-right">{item.nilai_perolehan}</td>

                                    {filter === "A" && (
                                        <>
                                            <td className="bg-gray-100 px-3 py-3">{item.ukuran}</td>
                                            <td className="bg-gray-100 px-3 py-3">{item.status_tanah}</td>
                                            <td className="bg-gray-100 px-3 py-3">{item.no_sertifikat}</td>
                                        </>
                                    )}

                                    {filter === "B" && (
                                        <>
                                            <td className="bg-gray-100 px-3 py-3">{item.no_rangka}</td>
                                            <td className="bg-gray-100 px-3 py-3">{item.no_mesin}</td>
                                            <td className="bg-gray-100 px-3 py-3">{item.no_pabrik}</td>
                                        </>
                                    )}

                                    {filter === "C" && (
                                        <>
                                            <td className="bg-gray-100 px-3 py-3">{item.kontruksi}</td>
                                            <td className="bg-gray-100 px-3 py-3">{item.luas_lantai}</td>
                                            <td className="bg-gray-100 px-3 py-3">{item.no_dokumen}</td>
                                        </>
                                    )}

                                    <td className="px-3 py-3">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Link to={`/data-induk/edit/${item.id}`} className="text-amber-600 hover:text-amber-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                            </Link>
                                            <button onClick={() => handleDelete(item.id, item.kode_barang)} className="text-red-600 hover:text-red-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                
            </div>

            {/* CARD VIEW - Mobile */}
            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        <p className="ml-3 text-sm text-gray-500">Memuat data...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg border border-gray-200 p-6">
                        {search.trim() !== "" ? (
                            <p className="text-red-500 italic">❌ Data tidak valid / tidak ditemukan untuk "{search}".</p>
                        ) : (
                            <p className="text-gray-500 italic">Belum ada data KIB yang tersedia.</p>
                        )}
                    </div>
                ) : (
                    filteredData.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{item.nama_barang}</h3>
                                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                        {item.kode_barang}
                                    </span>
                                </div>
                                <div className="flex gap-2 ml-3">
                                    <Link to={`/data-induk/edit/${item.id}`} className="text-amber-600 hover:text-amber-700 p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </Link>
                                    <button onClick={() => handleDelete(item.id, item.kode_barang)} className="text-red-600 hover:text-red-700 p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-500 block mb-1">No Register:</span>
                                    <span className="text-gray-900 font-medium">{item.no_register}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block mb-1">Jumlah:</span>
                                    <span className="text-gray-900 font-medium">{item.jumlah} Unit</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-500 block mb-1">Spesifikasi:</span>
                                    <span className="text-gray-900 font-medium">{item.spesifikasi}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block mb-1">Harga Satuan:</span>
                                    <span className="text-gray-900 font-medium">Rp. {formatCurrency(item.harga_satuan)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block mb-1">Nilai Perolehan:</span>
                                    <span className="text-gray-900 font-medium">{item.nilai_perolehan}</span>
                                </div>

                                {filter === "A" && (
                                    <>
                                        <div>
                                            <span className="text-gray-500 block mb-1">Ukuran:</span>
                                            <span className="text-gray-900 font-medium">{item.ukuran}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block mb-1">Status Tanah:</span>
                                            <span className="text-gray-900 font-medium">{item.status_tanah}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500 block mb-1">No Sertifikat:</span>
                                            <span className="text-gray-900 font-medium">{item.no_sertifikat}</span>
                                        </div>
                                    </>
                                )}

                                {filter === "B" && (
                                    <>
                                        <div>
                                            <span className="text-gray-500 block mb-1">No Rangka:</span>
                                            <span className="text-gray-900 font-medium">{item.no_rangka}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block mb-1">No Mesin:</span>
                                            <span className="text-gray-900 font-medium">{item.no_mesin}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500 block mb-1">No Pabrik:</span>
                                            <span className="text-gray-900 font-medium">{item.no_pabrik}</span>
                                        </div>
                                    </>
                                )}

                                {filter === "C" && (
                                    <>
                                        <div>
                                            <span className="text-gray-500 block mb-1">Kontruksi:</span>
                                            <span className="text-gray-900 font-medium">{item.kontruksi}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block mb-1">Luas Lantai:</span>
                                            <span className="text-gray-900 font-medium">{item.luas_lantai}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500 block mb-1">No Dokumen:</span>
                                            <span className="text-gray-900 font-medium">{item.no_dokumen}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>


{/* Modal Import */}
            {openImport && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

            <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Import Data KIB
            </h2>
            <p className="text-sm text-gray-500 mb-4">
                Upload file Excel (.xlsx / .xls)
            </p>

            {/* FILE INPUT */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-indigo-400 transition">
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files[0]?.name)}
                />
                <span className="text-3xl mb-2">📄</span>
                <span className="text-sm text-gray-600 text-center">
                    {fileName || "Klik untuk memilih file Excel"}
                </span>
            </label>

            {/* INFO */}
            <div className="mt-4 text-xs text-gray-500">
                <p>• Format harus sesuai template KIB</p>
                <p>• Maksimal ukuran file 5MB</p>
            </div>

            {/* ACTION */}
            <div className="flex justify-end gap-2 mt-6">
                <button
                    onClick={() => {
                        setOpenImport(false);
                        setFileName("");
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                    Batal
                </button>

                <button
                    disabled={!fileName}
                    className={`px-4 py-2 rounded-md text-sm text-white
                        ${fileName ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"}
                    `}
                >
                    Import
                </button>
            </div>

        </div>
    </div>
)}
        </>
    );
};

export default DataIndukContent;
