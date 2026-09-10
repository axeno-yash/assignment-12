import { Outlet } from "react-router-dom";
import { Footer, Header, ScrollToTop } from "./components/index.js";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;