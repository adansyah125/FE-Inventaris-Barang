import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function AddData() {
  const [form, setForm] = useState({
    kode_barang: "",
    nama_barang: "",
    type_kib: "tanah",
    nibar: "",
    no_register: "",
    spesifikasi: "",
    spesifikasi_tambahan: "",
    lokasi: "",
    no_rangka: "",
    no_mesin: "",
    no_pabrik: "",
    ukuran: "",
    status_tanah: "",
    no_sertifikat: "",
    kontruksi: "",
    luas_lantai: "",
    no_dokumen: "",
    jumlah: "",
    harga_satuan: "",
    nilai_perolehan: "",
    status_penggunaan: "",
    keterangan: "",
    gambar: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      const response = await axios.post("http://localhost:8000/api/kib", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Data berhasil disimpan!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="print:hidden">
          <Header />
        </div>

        {/* FORM */}
        <main className="p-8 flex-1">
          <h2 className="text-2xl font-bold text-green-700 mb-6 border-b pb-3">
            🌱 Tambah Data KIB
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GRID FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <FormInput label="Kode Barang" name="kode_barang" value={form.kode_barang} onChange={handleChange} />
              <FormInput label="Nama Barang" name="nama_barang" value={form.nama_barang} onChange={handleChange} />

              <FormSelect 
                label="Jenis KIB (type_kib)"
                name="type_kib"
                value={form.type_kib}
                onChange={handleChange}
                options={[
                  { value: "tanah", label: "KIB A - Tanah" },
                  { value: "mesin", label: "KIB B - Mesin" },
                  { value: "gedung", label: "KIB C - Gedung" },
                ]}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput type="number" label="NIBAR" name="nibar" value={form.nibar} onChange={handleChange} />
              <FormInput type="number" label="No Register" name="no_register" value={form.no_register} onChange={handleChange} />
              <FormInput label="Spesifikasi" name="spesifikasi" value={form.spesifikasi} onChange={handleChange} />
              </div>

              {form.type_kib === "tanah" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* KIB A */}
              <FormInput type="number" label="No Rangka" name="no_rangka" value={form.no_rangka} onChange={handleChange} />
              <FormInput type="number" label="No Mesin" name="no_mesin" value={form.no_mesin} onChange={handleChange} />
              <FormInput type="number" label="No Pabrik" name="no_pabrik" value={form.no_pabrik} onChange={handleChange} />
              </div>
              )}
             
             {form.type_kib === "mesin" && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput type="number" label="Ukuran" name="ukuran" value={form.ukuran} onChange={handleChange} />
              <FormInput label="Status Tanah" name="status_tanah" value={form.status_tanah} onChange={handleChange} />
              <FormInput label="No Sertifikat" name="no_sertifikat" value={form.no_sertifikat} onChange={handleChange} />
              </div>
             )}
             
             {form.type_kib === "gedung" && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput label="Kontruksi" name="kontruksi" value={form.kontruksi} onChange={handleChange} />
              <FormInput type="number" label="Luas Lantai" name="luas_lantai" value={form.luas_lantai} onChange={handleChange} />
              <FormInput label="No Dokumen" name="no_dokumen" value={form.no_dokumen} onChange={handleChange} />
              </div>
             )}
              
              <FormInput label="Spesifikasi Tambahan" name="spesifikasi_tambahan" value={form.spesifikasi_tambahan} onChange={handleChange} />

              <FormInput label="Lokasi" name="lokasi" value={form.lokasi} onChange={handleChange} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput type="number" step="0.01" label="Jumlah (Qty)" name="jumlah" value={form.jumlah} onChange={handleChange} />
              <FormInput type="number" step="0.01" label="Harga Satuan" name="harga_satuan" value={form.harga_satuan} onChange={handleChange} />
              <FormInput type="number" step="0.01" label="Nilai Perolehan" name="nilai_perolehan" value={form.nilai_perolehan} onChange={handleChange} />
              </div>

              {/* GAMBAR */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Gambar</label>
              <input
                type="file"
                name="gambar"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            </div>
              <FormInput label="Status Penggunaan" name="status_penggunaan" value={form.status_penggunaan} onChange={handleChange} />
              </div>

            {/* TEXTAREA */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Keterangan</label>
              <textarea
                name="keterangan"
                rows="2"
                value={form.keterangan}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              ></textarea>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end space-x-3">
              <Link
                to="/data-induk"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-200"
              >
                Kembali
              </Link>

              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Simpan Data
              </button>
            </div>
          </form>
        </main>

        <footer className="p-4 text-center text-xs text-gray-500 border-t border-gray-200 print:hidden">
          &copy; 2025 SIMBADA Kecamatan Bandung Kidul. All rights reserved. V1.4.0
        </footer>
      </div>
    </div>
  );
}


// Reusable Input Components
function FormInput({ label, name, value, onChange, type = "text", step }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        step={step}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
      />
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
      >
        {options.map((o, i) => (
          <option key={i} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default AddData;
