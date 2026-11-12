# RAMAH IKD Kecamatan Sagulung

Prototipe dashboard internal untuk monitoring pelayanan Identitas Kependudukan Digital (IKD).

## Menjalankan aplikasi

```powershell
npm.cmd install
npm.cmd run dev
```

Buka `http://localhost:5173`.

## Pemeriksaan produksi

```powershell
npm.cmd run lint
npm.cmd run build
```

## Fitur

- Dashboard statistik responsif
- Data pemohon dengan NIK tersamarkan
- Pencarian dan pembaruan status pelayanan
- Registrasi pemohon dengan validasi NIK
- Ringkasan kepuasan masyarakat
- Laporan CSV dengan NIK tersamarkan
- Navigasi desktop dan seluler

## Batas prototipe

Data masih berupa simulasi dan kembali ke kondisi awal setelah halaman dimuat ulang. Jangan gunakan data penduduk asli sebelum API, autentikasi berbasis peran, database terenkripsi, audit log server, HTTPS, backup, dan kebijakan retensi data diterapkan.
