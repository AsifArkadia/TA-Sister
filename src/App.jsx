import { useState } from "react";
import jsPDF from "jspdf";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("biodata");

  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [krs, setKrs] = useState([]);

  const matakuliah = [
    { nama: "Sistem Terdistribusi", sks: 3 },
    { nama: "Pemrograman Web Lanjut", sks: 3 },
    { nama: "Rekayasa Perangkat Lunak", sks: 3 },
    { nama: "Keamanan Jaringan", sks: 2 },
    { nama: "Data Mining", sks: 3 },
  ];

  const toggleMK = (mk) => {
    setKrs((prev) =>
      prev.find((m) => m.nama === mk.nama)
        ? prev.filter((m) => m.nama !== mk.nama)
        : [...prev, mk]
    );
  };

  const totalSKS = krs.reduce((sum, mk) => sum + mk.sks, 0);

  const generatePDF = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text("KARTU RENCANA STUDI (KRS)", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`NIM  : ${nim}`, 20, 35);
    pdf.text(`Nama : ${nama}`, 20, 43);

    pdf.text("Daftar Mata Kuliah:", 20, 60);

    krs.forEach((mk, i) => {
      pdf.text(`${i + 1}. ${mk.nama} (${mk.sks} SKS)`, 25, 70 + i * 8);
    });

    pdf.text(`Total SKS: ${totalSKS}`, 20, 70 + krs.length * 8 + 10);
    pdf.save("KRS_Mahasiswa.pdf");
  };

  return (
  <>
    {/* HEADER */}
    <header className="header">
      <div className="header-left">
        <span>SIAKAD KRS</span>
      </div>

      <div className="header-right">
        ☎ Call Center: <strong>0800-123-456</strong>
      </div>
    </header>

    {/* MAIN */}
    <main className="container">
      <h1>Sistem Input KRS Mahasiswa</h1>

      {/* === ISI APLIKASI (tidak berubah) === */}
      {page === "biodata" && (
        <div className="card">
          <h2>Biodata Mahasiswa</h2>

          <label>NIM</label>
          <input value={nim} onChange={(e) => setNim(e.target.value)} />

          <label>Nama Mahasiswa</label>
          <input value={nama} onChange={(e) => setNama(e.target.value)} />

          <button disabled={!nim || !nama} onClick={() => setPage("krs")}>
            Selanjutnya →
          </button>
        </div>
      )}

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
            <button disabled={krs.length === 0} onClick={() => setPage("hasil")}>
              Simpan KRS →
            </button>
          </div>
        </div>
      )}

      {page === "hasil" && (
        <div className="card">
          <h2>KRS Tersimpan</h2>
          <p><strong>NIM:</strong> {nim}</p>
          <p><strong>Nama:</strong> {nama}</p>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Mata Kuliah</th>
                <th>SKS</th>
              </tr>
            </thead>
            <tbody>
              {krs.map((mk, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{mk.nama}</td>
                  <td>{mk.sks}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="total"><strong>Total SKS:</strong> {totalSKS}</p>

          <div className="action">
            <button className="secondary" onClick={() => setPage("krs")}>
              ← Kembali
            </button>
            <button onClick={() => setPage("biodata")}>
              Ubah Biodata
            </button>
            <button onClick={generatePDF}>
              Download PDF
            </button>
          </div>
        </div>
      )}
    </main>

    {/* FOOTER */}
    <footer className="footer">
      © 2026 Sistem Terdistribusi
    </footer>
  </>
);
}