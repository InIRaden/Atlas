import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import { AtlasProvider } from "./context/AtlasContext"; // INI WAJIB ADA

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

  // PASTIKAN DEMO DIBUNGKUS SEPERTI INI
  return route === "demo" ? (
    <AtlasProvider>
      <Demo />
    </AtlasProvider>
  ) : (
    <Home />
  );
}