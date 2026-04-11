import { useEffect } from "react";

export default function Home() {
  const goToDemo = () => {
    window.location.hash = "#/demo";
  };

  return (
    <div className="page-shell">
      {/* --- NAVBAR --- */}
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand-group">
            <img src="/logo-atlas.svg" alt="Atlas Food Logo" className="logo-atlas-img" />
            <span className="brand-divider"></span>
            <img src="/logo-brin.png" alt="BRIN Logo" className="logo-brin-img" />
          </div>

          <nav className="site-nav">
            <a href="#" className="active">Beranda</a>
            <a href="#">Metodologi Riset BRIN</a>
            <a href="#">Analisis Nutrisi Cerdas</a>
            <a href="#">Data Riset</a>
            <a href="#">Kolaborasi Publikasi</a>
            <a href="#">Hubungi Tim Riset</a>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="hero-container">
        <div className="container hero-wrap">
          <div className="hero-copy">
            <h1>Analisis & Optimalkan Asupan Nutrisi Harian Anda</h1>
            <p>
              Atlas Food, hasil kolaborasi riset strategis dengan BRIN,
              menghadirkan sistem Nutrisi Recall Cerdas berbasis data ilmiah.
              Lacak, catat, dan analisis asupan nutrisi Anda dengan akurasi tinggi,
              didukung oleh metodologi riset nasional.
            </p>
            <button className="demo-btn" onClick={goToDemo}>
              Mulai Analisis Pola Makan
            </button>
          </div>

          <div className="hero-media">
            <img src="/hero-ipad.png" alt="Dashboard Atlas Food" className="hero-image-main" />
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="home-footer">
        <div className="container footer-inner">
          <div className="footer-content">
            <p>
              © 2026 Atlas Food. Proyek Penelitian Kerjasama 
              <strong> Universitas Pendidikan Indonesia</strong> & 
              <strong> Badan Riset dan Inovasi Nasional (BRIN)</strong>
            </p>
            <small>Sistem Informasi Nutrisi Terintegrasi untuk Inovasi Kesehatan Nasional</small>
          </div>
        </div>
      </footer>
    </div>
  );
}