// src/constants.js

export const PRIMARY_COLOR = "indigo";
export const PRIMARY_COLOR_CODE = "600";
export const BG_COLOR = "gray-50";

export const MENU_ITEMS = [
  { label: "Dashboard", icon: "🚀", id: "dashboard" },
  { label: "Data KIB", icon: "📋", id: "kib" },
  { label: "Data KIR", icon: "🖨️", id: "reports" },
  { label: "Cetak Label Aset", icon: "🏷️", id: "print_labels" },
  { label: "User", icon: "🛠️", id: "user" },
];

export const MODES = {
  VIEW_TABLE: "view_table",
  ADD_KIB: "add_kib",
  ADD_KIR: "add_kir",
  EDIT_ITEM: "edit_item",
  ADD_KIB_A: "add_kib_a",
  ADD_KIB_B: "add_kib_b",
  ADD_KIB_C: "add_kib_c",
};

// --- DEFINISI FIELD KIB SPESIFIK ---

export const KIB_TYPES = {
  A: {
    label: "KIB A: Tanah",
    icon: "🌳",
    mode: MODES.ADD_KIB_A,
    color: "green",
  },
  B: {
    label: "KIB B: Peralatan & Mesin",
    icon: "🖥️",
    mode: MODES.ADD_KIB_B,
    color: "blue",
  },
  C: {
    label: "KIB C: Gedung & Bangunan",
    icon: "🏛️",
    mode: MODES.ADD_KIB_C,
    color: "orange",
  },
};

// KIB A – TANAH
export const KIB_A_FIELDS = [
  { label: "Nama Barang", name: "nama_barang", type: "text", required: true },
  { label: "Kode Barang", name: "kode_barang", type: "text", required: true },
  { label: "NIB / Nomor Register", name: "noreg", type: "text" },
  { label: "Letak / Alamat Tanah", name: "letak_alamat", type: "text" },
  {
    label: "Status Tanah",
    name: "status_tanah",
    type: "select",
    options: ["Hak Milik", "Hak Pakai", "Hak Guna Bangunan", "Lainnya"],
  },
  {
    label: "Luas Tanah (m²)",
    name: "luas_tanah",
    type: "number",
    min: 0,
    required: true,
  },
  { label: "Penggunaan Tanah", name: "penggunaan_tanah", type: "text" },
  { label: "Nomor Sertifikat", name: "no_sertifikat", type: "text" },
  { label: "Tanggal Sertifikat", name: "tgl_sertifikat", type: "date" },
  { label: "Atas Nama Sertifikat", name: "atas_nama", type: "text" },
  { label: "Asal-usul Perolehan", name: "asal_usul", type: "text" },
  {
    label: "Tahun Perolehan",
    name: "tahun_perolehan",
    type: "number",
    min: 1900,
    max: new Date().getFullYear(),
    required: true,
  },
  {
    label: "Harga Perolehan (Rp)",
    name: "harga_perolehan",
    type: "number",
    required: true,
    min: 0,
  },
  { label: "Keterangan", name: "keterangan", type: "textarea", colSpan: 2 },
];

// KIB B – PERALATAN & MESIN
export const KIB_B_FIELDS = [
  { label: "Nama Barang", name: "nama_barang", type: "text", required: true },
  { label: "Kode Barang", name: "kode_barang", type: "text", required: true },
  { label: "Nomor Register", name: "noreg", type: "text" },
  { label: "Merk / Tipe", name: "merk_tipe", type: "text" },
  {
    label: "Ukuran / CC",
    name: "ukuran_cc",
    type: "text",
    placeholder: "Contoh: 150 CC",
  },
  {
    label: "Bahan",
    name: "bahan",
    type: "select",
    options: ["Metal", "Kayu", "Plastik", "Lainnya"],
  },
  {
    label: "Tahun Perolehan",
    name: "tahun_perolehan",
    type: "number",
    required: true,
    min: 1900,
    max: new Date().getFullYear(),
  },
  { label: "Nomor Pabrik", name: "no_pabrik", type: "text" },
  { label: "Nomor Rangka", name: "no_rangka", type: "text" },
  { label: "Nomor Mesin", name: "no_mesin", type: "text" },
  { label: "Nomor Polisi", name: "no_polisi", type: "text" },
  { label: "Asal-usul Perolehan", name: "asal_usul", type: "text" },
  {
    label: "Harga Perolehan (Rp)",
    name: "harga_perolehan",
    type: "number",
    required: true,
    min: 0,
  },
  {
    label: "Kondisi Barang",
    name: "kondisi",
    type: "select",
    options: ["Baik", "Rusak Ringan", "Rusak Berat"],
  },
  { label: "Lokasi / Ruangan", name: "lokasi", type: "text" },
  { label: "Keterangan", name: "keterangan", type: "textarea", colSpan: 2 },
];

// KIB C – GEDUNG & BANGUNAN
export const KIB_C_FIELDS = [
  {
    label: "Nama Gedung/Bangunan",
    name: "nama_bangunan",
    type: "text",
    required: true,
  },
  { label: "Kode Barang", name: "kode_barang", type: "text", required: true },
  { label: "Nomor Register", name: "noreg", type: "text" },
  {
    label: "Kondisi Bangunan",
    name: "kondisi_bangunan",
    type: "select",
    options: ["Baik", "Rusak Ringan", "Rusak Berat"],
  },
  {
    label: "Kontruksi Bangunan",
    name: "kontruksi",
    type: "select",
    options: ["Baja", "Beton", "Semi Permanen"],
  },
  {
    label: "Luas Lantai (m²)",
    name: "luas_lantai",
    type: "number",
    min: 0,
    required: true,
  },
  { label: "Jumlah Lantai", name: "jumlah_lantai", type: "number", min: 1 },
  { label: "Letak / Alamat Gedung", name: "letak_alamat", type: "text" },
  {
    label: "Dokumen Kepemilikan (No)",
    name: "no_dokumen",
    type: "text",
    placeholder: "IMB/Sertifikat No.",
  },
  { label: "Tanggal Dokumen", name: "tgl_dokumen", type: "date" },
  {
    label: "Status Tanah",
    name: "status_tanah",
    type: "text",
    placeholder: "Milik Pemerintah / Mandiri",
  },
  {
    label: "Tahun Perolehan",
    name: "tahun_perolehan",
    type: "number",
    required: true,
    min: 1900,
    max: new Date().getFullYear(),
  },
  { label: "Asal Perolehan", name: "asal_usul", type: "text" },
  {
    label: "Harga Perolehan (Rp)",
    name: "harga_perolehan",
    type: "number",
    required: true,
    min: 0,
  },
  { label: "Keterangan", name: "keterangan", type: "textarea", colSpan: 2 },
];
