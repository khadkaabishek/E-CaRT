// src/layouts/MainLayout.tsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./../styles/mainlayout.css";
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
