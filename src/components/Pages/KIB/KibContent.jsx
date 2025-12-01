import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

const DataIndukContent = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("all");


    // Ambil data dari backend
    

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/kib", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setData(res.data.data);
        } catch (err) {
            console.log("ERROR:", err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    // Filter berdasarkan KIB
    const filteredData = data.filter((item) => {
        if (filter === "all") return true;
        if (filter === "A") return item.type_kib === "tanah";
        if (filter === "B") return item.type_kib === "mesin";
        if (filter === "C") return item.type_kib === "gedung";
        return true;
    });


    return (
        <>
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-gray-100 mb-4">
                <div>
                    <h1 className="text-4xl font-light text-gray-900 tracking-tight">
                        Data Kartu Inventaris Barang <span className="font-bold text-indigo-600">KIB</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Kelola data aset inventaris negara (KIB/KIR).
                    </p>
                </div>
            </div>

            {/* FILTER */}
           <div className="relative flex space-x-6 w-full mb-4 border-b border-gray-200 pb-2">

            {[
                { key: "A", label: "🌱 KIB A (Tanah)" },
                { key: "B", label: "🔩 KIB B (Mesin)" },
                { key: "C", label: "🏗️ KIB C (Gedung)" },
                { key: "all", label: "🔍 Semua" },
            ].map((item) => (
                <button
                    key={item.key}
                    onClick={() => setFilter(item.key)}
                    className={`
                        relative pb-2 text-sm font-medium transition-all duration-300
                        ${filter === item.key ? "text-indigo-600" : "text-gray-600"}
                        hover:text-indigo-500
                    `}
                >
                    {item.label}

                    {/* Garis bawah aktif dengan animasi sliding */}
                    {filter === item.key && (
                        <motion.span
                            layoutId="underline"
                            className="absolute left-0 -bottom-[2px] h-[2px] bg-indigo-600 w-full rounded-full"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    )}
                </button>
            ))}

            </div>
            <div className="mb-5">
            <Link
                to={`/data-induk/tambah?kib=${filter}`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                Tambah Data
            </Link>
            </div>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
               
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-50 text-center text-xs font-semibold text-gray-700 uppercase border-b border-gray-300 sticky top-0">
    
                        {/* MODE 2 BARIS → KHUSUS KIB A/B/C */}
                        {(filter === "A" || filter === "B" || filter === "C") ? (
                            <>
                                {/* BARIS 1 */}
                                <tr>
                                    <th rowSpan="2" className="border-r px-3 py-3">Kode</th>
                                    <th rowSpan="2" className="border-r px-3 py-3">Nama Barang</th>
                                    <th rowSpan="2" className="border-r px-3 py-3">No Reg</th>
                                    <th rowSpan="2" className="border-r px-3 py-3">Spesifikasi</th>
                                    <th rowSpan="2" className="border-r px-3 py-3">Jumlah</th>
                                    <th rowSpan="2" className="border-r px-3 py-3">Harga Satuan</th>
                                    <th rowSpan="2" className="border-r px-3 py-3">Nilai Perolehan</th>

                                    {/* JUDUL BESAR */}
                                    {filter === "A" && (
                                        <th colSpan="3" className="border-r px-3 py-3 bg-indigo-100">KIB A</th>
                                    )}
                                    {filter === "B" && (
                                        <th colSpan="3" className="border-r px-3 py-3 bg-indigo-100">KIB B</th>
                                    )}
                                    {filter === "C" && (
                                        <th colSpan="3" className="border-r px-3 py-3 bg-indigo-100">KIB C</th>
                                    )}

                                    <th rowSpan="2" className="px-3 py-3">Aksi</th>
                                </tr>

                                {/* BARIS 2 */}
                                <tr>
                                    {filter === "A" && (
                                        <>
                                            <th className="border-r px-3 py-3">Ukuran</th>
                                            <th className="border-r px-3 py-3">Status Tanah</th>
                                            <th className="border-r px-3 py-3">No Sertifikat</th>
                                        </>
                                    )}

                                    {filter === "B" && (
                                        <>
                                            <th className="border-r px-3 py-3">No Rangka</th>
                                            <th className="border-r px-3 py-3">No Mesin</th>
                                            <th className="border-r px-3 py-3">No Pabrik</th>
                                        </>
                                    )}

                                    {filter === "C" && (
                                        <>
                                            <th className="border-r px-3 py-3">Kontruksi</th>
                                            <th className="border-r px-3 py-3">Luas Lantai</th>
                                            <th className="border-r px-3 py-3">No Dokumen</th>
                                        </>
                                    )}
                                </tr>
                            </>
                        ) : (
                            /* MODE 1 BARIS → FILTER = ALL */
                            <tr>
                                <th className="border-r px-3 py-3">Kode</th>
                                <th className="border-r px-3 py-3">Nama Barang</th>
                                <th className="border-r px-3 py-3">No Reg</th>
                                <th className="border-r px-3 py-3">Spesifikasi</th>
                                <th className="border-r px-3 py-3">Jumlah</th>
                                <th className="border-r px-3 py-3">Harga Satuan</th>
                                <th className="border-r px-3 py-3">Nilai Perolehan</th>
                                <th className="px-3 py-3">Aksi</th>
                            </tr>
                        )}
                    </thead>

                
                    <tbody className="text-xs">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="20" className="text-center py-10 text-gray-500 italic">
                                    Tidak ada data.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item) => (
                                <tr key={item.id} className="bg-white border-b hover:bg-indigo-50">
                                    <td className="border-r px-3 py-3 text-center">{item.kode_barang}</td>
                                    <td className="border-r px-3 py-3">{item.nama_barang}</td>
                                    <td className="border-r px-3 py-3 text-center">{item.no_register}</td>
                                    <td className="border-r px-3 py-3">{item.spesifikasi}</td>
                                    <td className="border-r px-3 py-3 text-center">{item.jumlah}</td>
                                    <td className="border-r px-3 py-3 text-right">{item.harga_satuan}</td>
                                    <td className="border-r px-3 py-3 text-right">{item.nilai_perolehan}</td>

                                    {/* KIB A */}
                                    {filter === "A" && (
                                        <>
                                            <td className="border-r px-3 py-3">{item.ukuran}</td>
                                            <td className="border-r px-3 py-3">{item.status_tanah}</td>
                                            <td className="border-r px-3 py-3">{item.no_sertifikat}</td>
                                        </>
                                    )}

                                    {/* KIB B */}
                                    {filter === "B" && (
                                        <>
                                            <td className="border-r px-3 py-3">{item.no_rangka}</td>
                                            <td className="border-r px-3 py-3">{item.no_mesin}</td>
                                            <td className="border-r px-3 py-3">{item.no_pabrik}</td>
                                        </>
                                    )}

                                    {/* KIB C */}
                                    {filter === "C" && (
                                        <>
                                            <td className="border-r px-3 py-3">{item.kontruksi}</td>
                                            <td className="border-r px-3 py-3">{item.luas_lantai}</td>
                                            <td className="border-r px-3 py-3">{item.no_dokumen}</td>
                                        </>
                                    )}

                                    <td className="px-3 py-3 text-center">
                                        <button className="text-blue-600 text-xs mr-2">Edit</button>
                                        <button className="text-red-600 text-xs">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default DataIndukContent;
