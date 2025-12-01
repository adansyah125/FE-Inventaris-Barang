export const getDashboardStats = (dataItems) => {
  const kibItems = dataItems.filter(
    (item) => item.jenis === "KIB" && item.nilaiNumerik > 0
  );
  const totalAset = kibItems.reduce((sum, item) => sum + item.jumlah, 0);
  const totalValuasi = kibItems.reduce(
    (sum, item) => sum + item.nilaiNumerik,
    0
  );
  const asetRusakBerat = kibItems
    .filter((item) => item.kondisi === "Rusak Berat")
    .reduce((sum, item) => sum + item.jumlah, 0);

  const kondisiData = kibItems.reduce((acc, item) => {
    const kondisi = item.kondisi === "Tersedia" ? "Baik" : item.kondisi;
    acc[kondisi] = (acc[kondisi] || 0) + item.jumlah;
    return acc;
  }, {});

  return {
    totalAset,
    totalValuasi: totalValuasi.toLocaleString("id-ID"),
    asetRusakBerat,
    kondisiData: [
      { label: "Baik", value: kondisiData["Baik"] || 0 },
      { label: "Kurang Baik", value: kondisiData["Kurang Baik"] || 0 },
      { label: "Rusak Berat", value: kondisiData["Rusak Berat"] || 0 },
    ].sort((a, b) => b.value - a.value),
  };
};
