import React from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function Layout({ children }) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="container-cyber">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
