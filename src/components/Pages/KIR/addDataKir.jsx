import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";

export default function AddData() {
  const navigate = useNavigate();

  const [kibs, setKibs] = useState([]);
  const [filteredKibs, setFilteredKibs] = useState([]);

  // FORM STATE
  const [form, setForm] = useState({
    kib_id: [],
    lokasi: "",
    kondisi: "",
    jumlah: "",
    tahun: "",
    nilai_perolehan: "",
  });

  // GET DATA KIB
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8000/api/kib", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setKibs(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  // HANDLE CHANGE FORM
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    // Jika pilih lokasi → filter KIB
    if (name === "lokasi") {
      const filtered = kibs.filter((k) => k.lokasi === value);
      setFilteredKibs(filtered);

      // reset jika ganti lokasi
      setForm((prev) => ({ ...prev, kib_id: [] }));
    }
  };

  // HANDLE CHECKBOX
  const handleCheckbox = (id) => {
    setForm((prev) => {
      const exists = prev.kib_id.includes(id);

      return {
        ...prev,
        kib_id: exists
          ? prev.kib_id.filter((x) => x !== id)
          : [...prev.kib_id, id],
      };
    });
  };

  // SUBMIT DATA (MULTI INSERT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (form.kib_id.length === 0) {
        toast.error("Pilih minimal 1 barang!");
        return;
      }

      // Ambil semua item KIB yang dicentang
      const selectedItems = kibs.filter((k) => form.kib_id.includes(k.id));

      // Membuat array payload
      const payload = selectedItems.map((item) => ({
        kib_id: item.id,
        nama_barang: item.nama_barang,
        kode_barang: item.kode_barang,
        tahun: form.tahun,
        status_penggunaan: item.status_penggunaan,
        jumlah: form.jumlah,
        nilai_perolehan: form.nilai_perolehan,
        lokasi: form.lokasi,
      }));

      // Kirim sebagai array
      await axios.post("http://localhost:8000/api/kir", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Semua data berhasil disimpan!");
      navigate("/laporan-kir");
    } catch (error) {
      console.log(error);
      toast.error("Gagal menyimpan data!");
    }
  };

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
            🌱 Tambah Data KIR
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* LOKASI */}
              <FormSelect
                label="Lokasi Ruangan"
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                options={[
                  { value: "", label: "-- Pilih Ruangan --" },
                  { value: "aula", label: "Aula" },
                  { value: "gedung a", label: "Gedung A" },
                  { value: "gedung b", label: "Gedung B" },
                  { value: "gedung c", label: "Gedung C" },
                  { value: "gedung d", label: "Gedung D" },
                ]}
              />

              {/* KONDISI */}
              {/* <FormSelect
                label="Kondisi Barang"
                name="kondisi"
                value={form.kondisi}
                onChange={handleChange}
                options={[
                  { value: "", label: "-- Pilih Kondisi --" },
                  { value: "baik", label: "Baik" },
                  { value: "kurang baik", label: "Kurang Baik" },
                  { value: "rusak berat", label: "Rusak Berat" },
                ]}
              /> */}

              {/* CHECKBOX LIST */}
              <div className="border p-3 rounded-md bg-gray-50 md:col-span-2 border-gray-200 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih KIB Berdasarkan Lokasi
                </label>

                {filteredKibs.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Pilih lokasi untuk melihat barang.
                  </p>
                ) : (
                  filteredKibs.map((k) => (
                    <div
                      key={k.id}
                      className="flex items-start gap-2 mb-3 p-2 border rounded-md bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={form.kib_id.includes(k.id)}
                        onChange={() => handleCheckbox(k.id)}
                        className="h-4 w-4 mt-1"
                      />

                      <div>
                        <p className="font-medium">{k.nama_barang}</p>
                        <p className="text-xs text-gray-600">
                          Kode: <b>{k.kode_barang}</b>
                        </p>
                        <p className="text-xs text-gray-600">
                          KIB: <b>{k.type_kib}</b>
                        </p>
                        <p className="text-xs text-gray-600">
                          Kondisi: <b className="capitalize">{k.status_penggunaan}</b>
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* JUMLAH */}
              <FormInput
                type="number"
                label="Jumlah"
                name="jumlah"
                value={form.jumlah}
                onChange={handleChange}
              />

              {/* TAHUN */}
              <FormInput
                type="date"
                label="Tahun Perolehan"
                name="tahun"
                value={form.tahun}
                onChange={handleChange}
              />

              {/* NILAI */}
              <FormInput
                type="number"
                step="0.01"
                label="Nilai Perolehan"
                name="nilai_perolehan"
                value={form.nilai_perolehan}
                onChange={handleChange}
              />
            </div>

            {/* BUTTON */}
            <div className="flex justify-end space-x-3">
              <Link
                to="/laporan-kir"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                Kembali
              </Link>

              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Simpan Data
              </button>
            </div>
          </form>
        </main>

        <footer className="p-4 text-center text-xs text-gray-500 border-t">
          © 2025 SIMBADA Kecamatan Bandung Kidul. V1.4.0
        </footer>
      </div>
    </div>
  );
}

// COMPONENT FORM
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
        className="mt-1 block w-full border rounded-md p-2 border-gray-200 shadow-sm "
        required
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
        className="mt-1 block w-full border rounded-md p-2 border-gray-200 shadow-sm "
      >
        {options.map((o, i) => (
          <option key={i} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
