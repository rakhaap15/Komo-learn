# TODO

## 1) Poin bertambah setiap jawaban benar
- [x] Update `app/lesson/quiz.tsx` akan memanggil action backend untuk menambah `user_progress.points`.

- [ ] Pastikan poin tidak dobel ketika klik tombol lanjut berulang.


## 2) Fitur laporan (4 laporan diminta, implement sekarang: laporan 1 & 2 dulu)

- [ ] Di finish screen `app/lesson/quiz.tsx`, buat 2 laporan yang bisa dicetak:
  - [ ] Laporan 1: waktu (time spent) + detail singkat
  - [ ] Laporan 2: nilai total + daftar benar/salah per soal
- [ ] Simpan data per-soal selama quiz untuk kebutuhan laporan (user jawaban + correct + benar/salah).
- [ ] Implement tombol “Cetak” per laporan menggunakan `window.print()` dan area print.

## 3) Testing
- [ ] Jalankan `npm run lint` atau `npm run build`.
- [ ] Verifikasi UI di browser.

