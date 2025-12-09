// ======================= CETAK LABEL =======================
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PreviewLabelBoxStatic = ({ data }) => {
  return (
    <div className="border border-yellow-500 bg-white p-1 shadow-md w-full max-w-[300px] mx-auto">
      <div className="flex items-center justify-between border-b border-gray-500 pb-0.5 mb-0.5">
        <div className="flex items-center">
          <img
            src="logo.png"
            alt="Logo"
            className="w-3 h-3 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "https://placehold.co/40x40/ffffff/1a1a4f?text=BK";
            }}
          />
          <span className="font-semibold text-[6px] leading-none">
            PEMERINTAH KOTA BANDUNG
          </span>
        </div>
        <span className="font-extrabold text-[6px] text-gray-700 leading-none">
          KEC. BANDUNG KIDUL
        </span>
      </div>

      <div className="flex gap-1 items-start h-10">
        <div className="flex flex-col items-center justify-center w-16 h-full border border-gray-400 p-0.5 flex-shrink-0">
          <img
            src={data?.gambar_qr || "https://placehold.co/40x40/ffffff/1a1a4f?text=QR"}
            alt="QR Code"
            className="w-7 h-7 object-cover"
          />
        </div>

        <div className="flex-1 text-left pt-0.5">
          <p className="text-[7px] leading-tight">
            <span className="w-8 inline-block font-bold">Kode</span>:
            <span className="font-semibold">{data?.kode_barang || "-"}</span>
          </p>
          <p className="text-[7px] leading-tight">
            <span className="w-8 inline-block font-bold">Nama</span>:
            <span className="font-semibold">{data?.nama_barang || "-"}</span>
          </p>
          <p className="text-[7px] leading-tight">
            <span className="w-8 inline-block font-bold">NUP</span>:
            <span className="font-semibold">{data?.nup || "0001"}</span>
          </p>
          <p className="text-[7px] leading-tight">
            <span className="w-8 inline-block font-bold">Tahun</span>:
            <span className="font-semibold">{data?.tahun || "-"}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function CetakLabel() {
  const handleDownloadPDF = () => {
  if (selected.length === 0) {
    toast.error("Pilih item terlebih dahulu!");
    return;
  }

  axios.post(
    "http://localhost:8000/api/kir/print-label",
    { ids: selected },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // penting!
    }
  )
  .then((res) => {
    const fileURL = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = "label-aset.pdf";
    link.click();
  })
  .catch(() => toast.error("Gagal mengunduh PDF"));
};

  const [kirItems, setKirItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
  // setLoading(true); 

  axios
    .get("http://localhost:8000/api/kir", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setKirItems(res.data.data);
    })
    .catch((err) => {
      console.log("ERROR:", err);
    })
    .finally(() => {
      setLoading(false); 
    });
}, []);


  const filteredItems = kirItems.filter((item) => {
    return (
      item.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_barang.toLowerCase().includes(search.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(search.toLowerCase())
    );
  });

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedItem =
    selected.length > 0
      ? kirItems.find((x) => x.id === selected[0])
      : null;

  return (
     <div className="w-full text-gray-800 print:hidden">
      {/* HEADER */}
      <h1 className="text-xl md:text-2xl font-bold mb-4">
         Cetak Label & Barcode Aset
      </h1>

      {/* LAYOUT - Stack on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        
        {/* ===================== LIST ITEM ===================== */}
        <div className="flex-1 p-4 md:p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Daftar Aset KIR Siap Cetak
          </h2>

          {/* SEARCH */}
          <div className="mb-4 md:mb-6">
            <input
              type="text"
              placeholder="Cari nama, kode, atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border px-3 md:px-4 py-2 rounded-lg bg-gray-50 border-gray-200 shadow-sm text-sm"
            />
          </div>

          {/* TOTAL */}
          <p className="text-sm text-gray-600 mb-3">
            Total Aset:{" "}
            <span className="font-bold text-base md:text-lg">
              {filteredItems.length}
            </span>
          </p>

          {/* TABLE - Desktop */}
          <div className="hidden md:block overflow-y-auto max-h-[400px] border border-gray-200 rounded-md">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="p-3 w-12"></th>
                  <th className="px-4 py-3 text-left">Nama Barang</th>
                  <th className="px-4 py-3 text-left">Kode Barang</th>
                  <th className="px-4 py-3 text-left">Lokasi</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        <p className="ml-3 text-sm text-gray-500">
                          Memuat data...
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && filteredItems.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      Data Tidak Ditemukan
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredItems.length > 0 &&
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {item.nama_barang}
                      </td>
                      <td className="px-4 py-2">{item.kode_barang}</td>
                      <td className="px-4 py-2">{item.lokasi}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* CARD LIST - Mobile */}
          <div className="md:hidden space-y-2 max-h-[400px] overflow-y-auto">
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="ml-3 text-sm text-gray-500">Memuat data...</p>
              </div>
            )}

            {!loading && filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Data Tidak Ditemukan
              </div>
            )}

            {!loading &&
              filteredItems.length > 0 &&
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-3 ${
                    selected.includes(item.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="mt-1 w-4 h-4 flex-shrink-0"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-gray-900 mb-1">
                        {item.nama_barang}
                      </p>
                      <p className="text-gray-600 text-xs">
                        <span className="font-medium">Kode:</span>{" "}
                        {item.kode_barang}
                      </p>
                      <p className="text-gray-600 text-xs">
                        <span className="font-medium">Lokasi:</span>{" "}
                        {item.lokasi}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ===================== PREVIEW + CETAK ===================== */}
        <div className="lg:w-96 w-full">
          <div className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="text-base md:text-lg font-bold mb-4">
              ⚙️ Konfigurasi Cetak
            </h2>

            {/* Preview Label */}
            <div className="mb-4">
              <PreviewLabelBoxStatic data={selectedItem} />
            </div>

            {/* Selected Count - Mobile Only */}
            {selected.length > 0 && (
              <div className="lg:hidden mb-3 p-2 bg-blue-100 text-blue-800 text-sm rounded-md text-center">
                <span className="font-bold">{selected.length}</span> item
                dipilih
              </div>
            )}

            <hr className="my-4" />

            {/* Print Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={selected.length === 0}
              className={`w-full p-2 md:p-3 rounded-lg font-semibold shadow-md transition text-sm md:text-base ${
                selected.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
              }`}
            >
              {selected.length === 0
                ? "Pilih Item Terlebih Dahulu"
                : `Cetak Label (${selected.length})`}
            </button>

            {/* Tips */}
            <div className="mt-4 p-3 bg-blue-100 text-blue-800 text-xs rounded-md">
              <p className="font-bold mb-1">Tips:</p>
              <p>
                Gunakan kertas label <b>Tom & Jerry No. 121</b> atau{" "}
                <b>Sticker HVS A4 Utuh</b> untuk hasil terbaik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
