import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function EditData() {

  const [oldImage, setOldImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const { id } = useParams();

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


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(`http://localhost:8000/api/kib/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm(res.data.data);
      setOldImage(res.data.data.gambar); // simpan gambar lama
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });
       const newErrors = validateForm();
      setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    toast.error("Periksa kembali data yang wajib diisi!");
    return;
  }

      data.append("_method", "PUT"); // untuk Laravel

      const response = await axios.post(
        `http://localhost:8000/api/kib/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Berhasil mengupdate KIB " + response.data.data.kode_barang);
      navigate("/data-induk");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengupdate data");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans bg-gray-100">
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="print:hidden">
          <Header />
        </div>

        <main className="p-8 flex-1">
          <h2 className="text-2xl font-bold text-green-700 mb-6 border-b pb-3">
            ✏️ Edit Data KIB
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <FormInput label="Kode Barang" name="kode_barang" value={form.kode_barang} onChange={handleChange} required />
              <FormInput label="Nama Barang" name="nama_barang" value={form.nama_barang} onChange={handleChange} required />

              <FormSelect
                label="Jenis KIB"
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
                  <FormInput type="number" label="Ukuran" name="ukuran" value={form.ukuran} onChange={handleChange} />
                  <FormInput label="Status Tanah" name="status_tanah" value={form.status_tanah} onChange={handleChange} />
                  <FormInput label="No Sertifikat" name="no_sertifikat" value={form.no_sertifikat} onChange={handleChange} />
                </div>
              )}

              {form.type_kib === "mesin" && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput type="number" label="No Rangka" name="no_rangka" value={form.no_rangka} onChange={handleChange} />
                  <FormInput type="number" label="No Mesin" name="no_mesin" value={form.no_mesin} onChange={handleChange} />
                  <FormInput type="number" label="No Pabrik" name="no_pabrik" value={form.no_pabrik} onChange={handleChange} />
                </div>
                
              )}

              {form.type_kib === "gedung" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput label="Kontruksi" name="kontruksi" value={form.kontruksi} onChange={handleChange} />
                  <FormInput type="number" label="Luas Lantai" name="luas_lantai" value={form.luas_lantai} onChange={handleChange} />
                  <FormInput label="No Dokumen" name="no_dokumen" value={form.no_dokumen} onChange={handleChange} />
                </div>
              )}

              {/* <FormInput label="Spesifikasi Tambahan" name="spesifikasi_tambahan" value={form.spesifikasi_tambahan} onChange={handleChange} /> */}
               <div>
              <label className="block text-sm font-medium text-gray-700">Spesifikasi Tambahan</label>
              <input
                name="spesifikasi_tambahan"
                type="text"
                value={form.spesifikasi_tambahan}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="(Optional)"
              ></input>
            </div>
              <FormInput label="Lokasi" name="lokasi" value={form.lokasi} onChange={handleChange} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput type="number" label="Jumlah" name="jumlah" value={form.jumlah} onChange={handleChange} />
                <FormInput type="number" label="Harga Satuan" name="harga_satuan" value={form.harga_satuan} onChange={handleChange} />
                <FormInput type="number" label="Nilai Perolehan" name="nilai_perolehan" value={form.nilai_perolehan} onChange={handleChange} />
              </div>
              
              {/* GAMBAR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>

                {/* GAMBAR LAMA */}
                {oldImage && !previewImage && (
                    <img
                    src={`http://localhost:8000/storage/${oldImage}`}
                    alt="Gambar Lama"
                    className="w-32 h-32 object-cover mb-3 rounded-md border"
                    />
                )}

                {/* UPLOAD BOX */}
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
                    {/* PREVIEW GAMBAR BARU */}
                    {previewImage ? (
                    <img
                        src={previewImage}
                        alt="Preview Baru"
                        className="mx-auto h-40 object-cover rounded-md"
                    />
                    ) : (
                    <div className="text-gray-500">
                        <p className="font-medium">Choose Image or Drag & Drop</p>
                        <p className="text-sm">PNG, JPG, JPEG</p>
                    </div>
                    )}
                </div>

                    {/* INPUT FILE TERSEMBUNYI */}
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="(Optional)"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <Link to={"/data-induk"} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-200">
                Kembali
              </Link>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Update Data
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}

function FormInput({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
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

export default EditData;
