import Navbar from "./Navbar";
import Footer from "./Footer";

function PageShell({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default PageShell;