import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Atlas Food beranda">
          <img src="/logo.svg" alt="Atlas Food" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="site-nav"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Menu
        </button>

        <nav className={`site-nav ${isOpen ? "open" : ""}`} id="site-nav" aria-label="Navigasi utama">
          <a className="active" href="#">Beranda</a>
          <a href="#">Tentang</a>
          <a href="#">Metodologi</a>
          <a href="#">Fitur</a>
          <a href="#">Sumber daya</a>
          <a className="contact-btn" href="#">Hubungi Kami</a>
        </nav>
      </header>

      <main className="hero-wrap">
        <section className="hero-copy">
          <span className="hero-kicker" aria-hidden="true">
            {'\''}
          </span>
          <h1>Cara mudah mengukur pola makan harian</h1>
          <p>
            Atlas Food adalah sistem dietary recall berbasis multiple-pass yang membantu pengguna
            mencatat intake makanan dan minuman secara lebih akurat.
          </p>
          <button
            type="button"
            className="demo-btn"
            onClick={() => {
              window.location.hash = "#/demo";
            }}
          >
            Coba Demo Alur Final
          </button>
        </section>

        <section className="hero-media" aria-label="Ilustrasi Atlas Food">
          <img src="/hero.svg" alt="Ilustrasi Atlas Food" />
        </section>
      </main>
    </div>
  );
}