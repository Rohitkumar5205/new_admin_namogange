import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Passengers from "./pages/Passengers";
import Partners from "./pages/Partners";

function App() {
  return (
    <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/passengers" element={<Passengers />} />
          <Route path="/drivers/partners" element={<Partners />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  );
}

export default App;
