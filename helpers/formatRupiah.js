function formatRupiah(price) {
  return price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  });
}

module.exports = { formatRupiah };
