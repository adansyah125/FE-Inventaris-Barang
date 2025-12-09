import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AddData() {
  const navigate = useNavigate();
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

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
  const rules = {
    kode_barang: "Kode barang wajib diisi",
    nama_barang: "Nama barang wajib diisi",
    type_kib: "Jenis KIB wajib dipilih",
    jumlah: "Jumlah wajib diisi",
    harga_satuan: "Harga satuan wajib diisi",
    nilai_perolehan: "Nilai perolehan wajib diisi",
    lokasi: "Lokasi ruangan wajib dipilih",
    nibar: "NIBAR wajib diisi",
    no_register: "Nomor register wajib diisi",
    spesifikasi: "Spesifikasi wajib diisi",
    status_penggunaan: "Status penggunaan wajib dipilih",
    gambar: "Gambar wajib diupload"
  };

  // KIB khusus
  const kibRules = {
    tanah: {
      ukuran: "Ukuran wajib diisi",
      status_tanah: "Status tanah wajib diisi",
      no_sertifikat: "Nomor sertifikat wajib diisi"
    },
    mesin: {
      no_rangka: "No rangka wajib diisi",
      no_mesin: "No mesin wajib diisi",
      no_pabrik: "No pabrik wajib diisi"
    },
    gedung: {
      kontruksi: "Konstruksi wajib diisi",
      luas_lantai: "Luas lantai wajib diisi",
      no_dokumen: "Dokumen wajib diisi"
    }
  };

  let newErrors = {};

  // Loop validasi default
  for (let field in rules) {
    if (!form[field] || !String(form[field]).trim()) {
      newErrors[field] = rules[field];
    }
  }

  // Loop validasi khusus KIB
  if (form.type_kib && kibRules[form.type_kib]) {
    for (let field in kibRules[form.type_kib]) {
      if (!form[field] || !String(form[field]).trim()) {
        newErrors[field] = kibRules[form.type_kib][field];
      }
    }
  }

  return newErrors;
};



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

      const newErrors = validateForm();
  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    toast.error("Periksa kembali data yang wajib diisi!");
    return;
  }

      const response = await axios.post("http://localhost:8000/api/kib", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("KIB  " + response.data.data.kode_barang + " berhasil ditambahkan");
      navigate("/data-induk");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <div className="print:hidden">
        <Sidebar  />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="print:hidden">
          <Header activeMenuLabel="Tambah Data KIB" />
        </div>

        {/* FORM */}
        <main className="p-8 flex-1">
          <h2 className="text-2xl font-bold text-green-700 mb-6 border-b pb-3">
            🌱 Tambah Data KIB
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GRID FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <FormInput label="Kode / NUP" name="kode_barang" value={form.kode_barang} onChange={handleChange} error={errors.kode_barang} />
              <FormInput label="Nama Barang" name="nama_barang" value={form.nama_barang} onChange={handleChange} error={errors.nama_barang} />

              <FormSelect 
                label="Jenis KIB (type_kib)"
                name="type_kib"
                value={form.type_kib}
                onChange={handleChange}
                error={errors.type_kib}
                options={[
                  { value: "tanah", label: "KIB A - Tanah" },
                  { value: "mesin", label: "KIB B - Mesin" },
                  { value: "gedung", label: "KIB C - Gedung" },
                ]}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput type="number" label="NIBAR" name="nibar" value={form.nibar} onChange={handleChange} error={errors.nibar} />
              <FormInput type="number" label="No Register" name="no_register" value={form.no_register} onChange={handleChange} error={errors.no_register} />
              <FormInput label="Spesifikasi" name="spesifikasi" value={form.spesifikasi} onChange={handleChange} error={errors.spesifikasi} />
              </div>

              {form.type_kib === "tanah" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput type="number" label="Ukuran" name="ukuran" value={form.ukuran} onChange={handleChange} error={errors.ukuran} />
              <FormInput label="Status Tanah" name="status_tanah" value={form.status_tanah} onChange={handleChange} error={errors.status_tanah} />
              <FormInput label="No Sertifikat" name="no_sertifikat" value={form.no_sertifikat} onChange={handleChange} error={errors.no_sertifikat} />
              </div>
              
              )}
             
             {form.type_kib === "mesin" && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput type="number" label="No Rangka" name="no_rangka" value={form.no_rangka} onChange={handleChange} error={errors.no_rangka} />
              <FormInput type="number" label="No Mesin" name="no_mesin" value={form.no_mesin} onChange={handleChange} error={errors.no_mesin} />
              <FormInput type="number" label="No Pabrik" name="no_pabrik" value={form.no_pabrik} onChange={handleChange} error={errors.no_pabrik} />
              </div>
             )}
             
             {form.type_kib === "gedung" && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput label="Kontruksi" name="kontruksi" value={form.kontruksi} onChange={handleChange} error={errors.kontruksi} />
              <FormInput type="number" label="Luas Lantai" name="luas_lantai" value={form.luas_lantai} onChange={handleChange} error={errors.luas_lantai} />
              <FormInput label="No Dokumen" name="no_dokumen" value={form.no_dokumen} onChange={handleChange} error={errors.no_dokumen} />
              </div>
             )}
              
              <FormInput label="Spesifikasi Tambahan" name="spesifikasi_tambahan" value={form.spesifikasi_tambahan} onChange={handleChange} placeholder="(Optional)" />

              <FormSelect 
                label="Lokasi Ruangan"
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                error={errors.lokasi}
                options={[
                  { value: "", label: "-- Pilih Ruangan --" },
                  { value: "aula", label: "Aula" },
                  { value: "gedung a", label: "gedung A" },
                  { value: "gedung b", label: "gedung B" },
                  { value: "gedung c", label: "gedung C" },
                  { value: "gedung d", label: "gedung D" },
                ]}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput type="number" step="0.01" label="Jumlah (Qty)" name="jumlah" value={form.jumlah} onChange={handleChange} error={errors.jumlah} />
              <FormInput type="number" step="0.01" label="Harga Satuan" name="harga_satuan" value={form.harga_satuan} onChange={handleChange} error={errors.harga_satuan} />
              <FormInput type="number" step="0.01" label="Nilai Perolehan" name="nilai_perolehan" value={form.nilai_perolehan} onChange={handleChange} error={errors.nilai_perolehan} />
              </div>

              {/* GAMBAR */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>

                <div
                  className="border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer 
                            hover:border-blue-500 transition text-center"
                  onClick={() => document.getElementById("fileUpload").click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      setForm({ ...form, gambar: file });
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="mx-auto h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="text-gray-500">
                      <p className="font-medium">Choose Image or Drag & Drop</p>
                      <p className="text-sm">PNG, JPG, JPEG</p>
                    </div>
                  )}
              </div>

                <input
                  id="fileUpload"
                  type="file"
                  name="gambar"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setForm({ ...form, gambar: file });
                    setPreviewImage(URL.createObjectURL(file));
                  }}
                  
                />
              </div>

              <FormSelect
                label="Kondisi"
                name="status_penggunaan"
                value={form.status_penggunaan}
                onChange={handleChange}
                error={errors.status_penggunaan}
                options={[
                  { value: "", label: "-- Kondisi Barang --" },
                  { value: "baik", label: "Baik" },
                  { value: "kurang baik", label: "Kurang Baik" },
                  { value: "rusak berat", label: "Rusak Berat" },
                ]}
              />
              </div>

            {/* TEXTAREA */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Keterangan</label>
              <textarea
                name="keterangan"
                rows="2"
                value={form.keterangan}
                onChange={handleChange}
                error={errors.keterangan}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="(Opsional)"
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
function FormInput({ label, name, value, onChange, type = "text", step, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        step={step}
        onChange={onChange}
        className={`mt-1 block w-full border rounded-md shadow-sm p-2 
          ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}


function FormSelect({ label, name, value, onChange, options, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full border rounded-md shadow-sm p-2 
          ${error ? "border-red-500" : "border-gray-300"}`}
      >
        {options.map((o, i) => (
          <option key={i} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}


export default AddData;
