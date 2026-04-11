import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Demo from "./pages/Demo"; // Memanggil file Demo yang baru dibuat

function getCurrentRoute() {
  return window.location.hash === "#/demo" ? "demo" : "home";
}

export default function App() {
  const [route, setRoute] = useState(getCurrentRoute);

  useEffect(() => {
    function handleHashChange() {
      setRoute(getCurrentRoute());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Jika URL-nya ada #/demo, tampilkan form. Jika tidak, tampilkan Beranda.
  return route === "demo" ? <Demo /> : <Home />;
}