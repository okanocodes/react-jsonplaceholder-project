import { Outlet } from "react-router";
import Navbar from "./ui/Navbar";

export default function Layout() {
  return (
    <div>
      <Navbar />
      {/* will either be <Home> or <Settings> */}
      <div className="p-2 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
}
