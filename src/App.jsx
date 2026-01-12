import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { supabase } from "./supabase";
import "./App.css";

export default function App() {
  // =========================
  // STATE
  // =========================
  const [page, setPage] = useState("biodata");
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [krs, setKrs] = useState([]);
  const [allMahasiswa, setAllMahasiswa] = useState([]);

  // =========================
  // DATA MATA KULIAH
  // =========================
  const matakuliah = [
    { nama: "Sistem Terdistribusi", sks: 3 },
    { nama: "Pemrograman Web Lanjut", sks: 3 },
    { nama: "Rekayasa Perangkat Lunak", sks: 3 },
    { nama: "Pemrograman Sisi Klien", sks: 3 },
    { nama: "Keamanan Jaringan", sks: 2 },
    { nama: "Data Mining", sks: 3 },
    { nama: "Kriptografi", sks: 3 },
  ];

  // =========================
  // PILIH / HAPUS MATA KULIAH
  // =========================
  const toggleMK = (mk) => {
    setKrs((prev) =>
      prev.some((m) => m.nama === mk.nama)
        ? prev.filter((m) => m.nama !== mk.nama)
        : [...prev, mk]
    );
  };

  const totalSKS = krs.reduce((sum, mk) => sum + mk.sks, 0);

  // =========================
  // SIMPAN KRS KE SUPABASE
  // =========================
  const simpanKRS = async () => {
    const data = krs.map((mk) => ({
      nim,
      nama,
      matakuliah: mk.nama,
      sks: mk.sks,
    }));

    const { error } = await supabase.from("krs").insert(data);

    if (!error) {
      setPage("hasil");
    } else {
      alert("Gagal menyimpan KRS");
    }
  };

  // =========================
  // AMBIL SEMUA MAHASISWA
  // =========================
  useEffect(() => {
    if (page === "peserta") {
      const fetchMahasiswa = async () => {
        const { data } = await supabase
          .from("krs")
          .select("nim, nama");

        // Hilangkan duplikasi berdasarkan NIM
        const unique = Object.values(
          data.reduce((acc, cur) => {
            acc[cur.nim] = cur;
            return acc;
          }, {})
        );

        setAllMahasiswa(unique);
      };

      fetchMahasiswa();
    }
  }, [page]);

  // =========================
  // DOWNLOAD PDF KRS PER MAHASISWA
  // =========================
  const downloadKRSByNIM = async (nim, nama) => {
    const { data } = await supabase
      .from("krs")
      .select("matakuliah, sks")
      .eq("nim", nim);

    const totalSKS = data.reduce((t, mk) => t + mk.sks, 0);

    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text("KARTU RENCANA STUDI (KRS)", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`NIM  : ${nim}`, 20, 35);
    pdf.text(`Nama : ${nama}`, 20, 43);

    pdf.text("Daftar Mata Kuliah:", 20, 60);
    data.forEach((mk, i) => {
      pdf.text(
        `${i + 1}. ${mk.matakuliah} (${mk.sks} SKS)`,
        25,
        70 + i * 8
      );
    });

    pdf.text(`Total SKS: ${totalSKS}`, 20, 70 + data.length * 8 + 10);

    // Waktu download (kanan bawah)
    const now = new Date().toLocaleString("id-ID");
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(10);
    pdf.text(
      `Diunduh pada: ${now} WIB`,
      w - 20,
      h - 15,
      { align: "right" }
    );

    pdf.save(`KRS_${nim}.pdf`);
  };

  // =========================
  // UI
  // =========================
  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-left">SIAKAD KRS</div>
        <div className="header-right">
          ☎ Call Center: <strong>0800-123-456</strong>
        </div>
      </header>

      {/* MAIN */}
      <main className="container">
        <h1>Sistem Input KRS Mahasiswa</h1>

        {/* BIODATA */}
        {page === "biodata" && (
          <div className="card">
            <h2>Biodata Mahasiswa</h2>
            <label>NIM</label>
            <input value={nim} onChange={(e) => setNim(e.target.value)} />
            <label>Nama</label>
            <input value={nama} onChange={(e) => setNama(e.target.value)} />
            <div className="action">
            <button disabled={!nim || !nama} onClick={() => setPage("krs")}>
              Selanjutnya →
            </button>
            <button onClick={() => setPage("peserta")}>
                Lihat Semua Mahasiswa
              </button></div>
          </div>
        )}

        {/* PILIH KRS */}
        {page === "krs" && (
          <div className="card">
            <h2>Pilih Mata Kuliah</h2>

            {matakuliah.map((mk, i) => (
              <label className="checkbox" key={i}>
                <input
                  type="checkbox"
                  checked={krs.some((m) => m.nama === mk.nama)}
                  onChange={() => toggleMK(mk)}
                />
                {mk.nama} ({mk.sks} SKS)
              </label>
            ))}

            <p className="total"><strong>Total SKS:</strong> {totalSKS}</p>

            <div className="action">
              <button className="secondary" onClick={() => setPage("biodata")}>
                ← Kembali
              </button>
              <button disabled={krs.length === 0} onClick={simpanKRS}>
                Simpan KRS →
              </button>
            </div>
          </div>
        )}

        {/* HASIL */}
        {page === "hasil" && (
          <div className="card">
            <h2>KRS Berhasil Disimpan</h2>
            <p><strong>{nim}</strong> - {nama}</p>

            <div className="action">
              <button onClick={() => setPage("peserta")}>
                Lihat Semua Mahasiswa
              </button>
              <button onClick={() => setPage("biodata")}>
                Input Ulang
              </button>
            </div>
          </div>
        )}

        {/* DAFTAR MAHASISWA */}
        {page === "peserta" && (
          <div className="card">
            <h2>Mahasiswa yang Sudah Mengisi KRS</h2>

            <table>
              <thead>
                <tr>
                  <th>NIM</th>
                  <th>Nama</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {allMahasiswa.map((mhs, i) => (
                  <tr key={i}>
                    <td>{mhs.nim}</td>
                    <td>{mhs.nama}</td>
                    <td>
                      <button
                        onClick={() =>
                          downloadKRSByNIM(mhs.nim, mhs.nama)
                        }
                      >
                        Download KRS PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="secondary" onClick={() => setPage("hasil")}>
              ← Kembali
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        Asif © 2026 Sistem Terdistribusi
      </footer>
    </>
  );
}
