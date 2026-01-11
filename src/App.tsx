import "./App.css";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="font-sans min-h-screen bg-gray-50 text-gray-900">
      <header className="p-4 shadow bg-white">
        <h1 className="text-xl font-bold">Mi Aplicación</h1>
      </header>

      <Outlet />
    </div>
  );
}
