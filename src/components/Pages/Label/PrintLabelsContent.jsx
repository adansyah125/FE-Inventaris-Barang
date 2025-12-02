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
              e.target.src =
                "https://placehold.co/40x40/ffffff/1a1a4f?text=BK";
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
            src={data?.gambar_qr || "https://placehold.co/40x40/ffffff/1a1a4f?text=" }
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

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/kir", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setKirItems(res.data.data))
      .catch((err) => console.log("ERROR:", err));
  }, []);

  const filteredItems = kirItems.filter((item) => {
    return (
      item.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_barang.toLowerCase().includes(search.toLowerCase()) ||
      item.lokasi_ruangan.toLowerCase().includes(search.toLowerCase())
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

  // ===================== CETAK =====================
//   const handlePrint = () => {
//   if (selected.length === 0) {
//     toast.error("Pilih item terlebih dahulu!");
//     return;
//   }

//   const itemsToPrint = kirItems.filter((x) => selected.includes(x.id));

//   const html = `
// <html>
//   <head>
//     <title>Cetak Label</title>
//     <style>
//       body {
//         font-family: Arial;
//         background: #f5f5f5;
//         padding: 20px;
//       }
//       .label {
//         border: 1px solid #d4a017;
//         background: white;
//         padding: 4px;
//         width: 300px;
//         margin: 0 auto 10px;
//         box-shadow: 0 1px 3px rgba(0,0,0,0.2);
//       }
//       .header {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         border-bottom: 1px solid #777;
//         padding-bottom: 2px;
//         margin-bottom: 2px;
//       }
//       .header-left {
//         display: flex;
//         align-items: center;
//         gap: 3px;
//       }
//       .header-left img {
//         width: 10px;
//         height: 10px;
//         border-radius: 50%;
//         object-fit: cover;
//       }
//       .header-text {
//         font-size: 6px;
//         font-weight: 600;
//         line-height: 1;
//       }
//       .header-right {
//         font-size: 6px;
//         font-weight: 800;
//         color: #444;
//         line-height: 1;
//       }
//       .content {
//         display: flex;
//         gap: 4px;
//         height: 40px;
//       }
//       .qr-box {
//         width: 60px;
//         height: 90%;
//         border: 1px solid #888;
//         padding: 2px;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//       }
//       .qr-box img {
//         width: 28px;
//         height: 28px;
//         object-fit: cover;
//       }
//       .details {
//         flex: 1;
//         padding-top: 2px;
//         font-size: 7px;
//         line-height: 1.1;
//       }
//       .label-field {
//         margin: 1px 0;
//       }
//       .label-field span.title {
//         width: 30px;
//         display: inline-block;
//         font-weight: bold;
//       }
//       .label-field span.value {
//         font-weight: 600;
//       }
//     </style>
//   </head>

//   <body>
//     ${itemsToPrint
//       .map((data) => {
//         // const logoUrl = `${window.location.origin}/logo.png`;
//         // const qrUrl = `${window.location.origin}/storage/${data.gambar_qr}`;

//         return `
//           <div class="label">

//             <div class="header">
//               <div class="header-left">
//                 <img src="logo.png" />
//                 <span class="header-text">PEMERINTAH KOTA BANDUNG</span>
//               </div>
//               <span class="header-right">KEC. BANDUNG KIDUL</span>
//             </div>

//             <div class="content">
//               <div class="qr-box">
//                 <img src="${data.gambar_qr}" />
//               </div>

//               <div class="details">
//                 <p class="label-field"><span class="title">Kode</span>: <span class="value">${data.kode_barang}</span></p>
//                 <p class="label-field"><span class="title">Nama</span>: <span class="value">${data.nama_barang}</span></p>
//                 <p class="label-field"><span class="title">NUP</span>: <span class="value">${data.nup || "0001"}</span></p>
//                 <p class="label-field"><span class="title">Tahun</span>: <span class="value">${data.tahun}</span></p>
//               </div>
//             </div>

//           </div>
//         `;
//       })
//       .join("")}

//     <script>
//       window.print();
//     </script>

//   </body>
// </html>
//   `;

//   const printWindow = window.open("", "_blank");
//   printWindow.document.write(html);
//   printWindow.document.close();
// };


  return (
    <div className="w-full text-gray-800 print:hidden">

      <h1 className="text-2xl font-bold mb-4">
        🖨️ Cetak Label & Barcode Aset (DINAMIS)
      </h1>

      <div className="flex gap-6">
        {/* ===================== LIST ITEM ===================== */}
        <div className="flex-1 p-6 bg-white rounded-xl shadow-lg border border-gray-100">

          <h2 className="text-xl font-semibold mb-4">Daftar Aset KIR Siap Cetak</h2>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Cari nama barang, kode, atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg bg-gray-50"
            />
          </div>

          <p className="text-sm text-gray-600 mb-3">
            Total Aset: <span className="font-bold text-lg">{filteredItems.length}</span>
          </p>

          <div className="overflow-y-auto max-h-[400px] border border-gray-200 rounded-md">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="p-3"></th>
                  <th className="px-4 py-3 text-left">Nama Barang</th>
                  <th className="px-4 py-3 text-left">Kode Barang</th>
                  <th className="px-4 py-3 text-left">Lokasi</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>

                    <td className="px-4 py-2 font-medium">{item.nama_barang}</td>
                    <td className="px-4 py-2">{item.kode_barang}</td>
                    <td className="px-4 py-2">{item.lokasi_ruangan}</td>
                  </tr>
                ))}

                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================== PREVIEW + CETAK ===================== */}
        <div className="w-96">
          <div className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="text-lg font-bold mb-4">⚙️ Konfigurasi Cetak (Satuan)</h2>

            <PreviewLabelBoxStatic data={selectedItem} />

            <hr className="my-4" />

            <button
              onClick={handleDownloadPDF}
              className="w-full bg-blue-500 text-white p-2 rounded-lg font-semibold shadow-md cursor-pointer"
            >
              Cetak Label
            </button>
            <div className="mt-4 p-3 bg-blue-100 text-blue-800 text-xs rounded-md">
        <p className="font-bold">Tips:</p>
        <p>
          Gunakan kertas label <b>Tom & Jerry No. 121</b> atau{' '}
          <b>Sticker HVS A4 Utuh</b> untuk hasil terbaik.
        </p>
      </div>
          </div>
        </div>
       
      </div>
    </div>
  );
}
