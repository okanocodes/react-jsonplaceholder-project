import { NavLink } from "react-router";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <div className="navbar bg-primary text-primary-content shadow-sm relative z-10">
      <div className="navbar-start gap-2">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-primary rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  [
                    isActive ? "underline decoration-2 underline-offset-4" : "",
                  ].join(" ")
                }
              >
                Users
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  [
                    isActive ? "underline decoration-2 underline-offset-4" : "",
                  ].join(" ")
                }
              >
                Posts
              </NavLink>
            </li>
          </ul>
        </div>
        {/* <a className="btn btn-ghost text-xl">Home</a> */}
        <NavLink
          to="/"
          className={({ isActive, isPending }) =>
            [
              "text-xl btn-ghost hover:underline hover:decoration-2 hover:underline-offset-4",
              isActive
                ? "underline decoration-2 underline-offset-4"
                : isPending
                  ? "text-orange-400"
                  : "",
            ].join(" ")
          }
          end
        >
          Home
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                [
                  isActive ? "underline decoration-2 underline-offset-4" : "",
                ].join(" ")
              }
            >
              Users
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/posts"
              className={({ isActive }) =>
                [
                  isActive ? "underline decoration-2 underline-offset-4" : "",
                ].join(" ")
              }
            >
              Posts
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
