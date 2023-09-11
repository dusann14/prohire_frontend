import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/NavBar.css";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select, { components } from "react-select";
import { MdAccountCircle } from "react-icons/md";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const handleNavbar = () => setToggleMenu(!toggleMenu);

  let navigate = useNavigate();

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 220,
    }),
  };

  function items() {
    var user = JSON.parse(sessionStorage.getItem("user"));
    if (user === null || sessionStorage.length === 0) {
      return (
        <li className="nav-item">
          <Link to="/login" className="text-uppercase fw-7 fs-24">
            Prijavi se
          </Link>
        </li>
      );
    } else if (user !== null) {
      let options = [];

      if (user.appUserRole === "JOB_SEEKER") {
        options = [
          { value: "1", label: "Moj profil", link: "/profile" },
          { value: "2", label: "Moje prijave", link: "/profile/applications" },
          { value: "3", label: "Odjava", link: "/login" },
        ];
      } else if (user.appUserRole === "EMPLOYER") {
        options = [
          { value: "1", label: "Objavi posao", link: "/job/post" },
          { value: "2", label: "Moji poslovi", link: "/jobs" },
          { value: "3", label: "Odjava", link: "/login" },
        ];
      }

      return (
        <li className="nav-item">
          <MdAccountCircle style={{ fontSize: "30px" }}></MdAccountCircle>
          <Select
            options={options.map((option) => ({
              ...option,
              label: (
                <Link to={option.link} className="option-link">
                  {option.label}
                </Link>
              ),
            }))}
            styles={customStyles}
            placeholder={user.firstName}
            className="text-uppercase fw-7 fs-18"
          ></Select>
        </li>
      );
    }
  }

  return (
    <nav className="navbar sticky" id="navbar">
      <div className="container" style={{ display: "flex" }}>
        <div className="brand-and-toggler flex flex-sb">
          <div
            style={{
              display: "flex",
              gap: "5px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {" "}
            <span
              className="text-uppercase fw-7 fs-24"
              onClick={() => {
                navigate("/home");
              }}
              style={{ cursor: "pointer" }}
            >
              ProHire
            </span>
            <span>
              <img className="logo" src="/6956765.png" alt="" />
            </span>
          </div>

          <button
            type="button"
            className="navbar-toggler-btn"
            onClick={handleNavbar}
          >
            <HiOutlineMenuAlt3
              size={35}
              style={{
                color: `${toggleMenu ? "#010101" : "#010101"}`,
              }}
            />
          </button>
        </div>

        <div
          className={
            toggleMenu
              ? "navbar-collapse show-navbar-collapse"
              : "navbar-collapse"
          }
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/home" className="text-uppercase fw-7 fs-24">
                Poslovi
              </Link>
            </li>
            <li className="nav-item">
              <div
                className="text-uppercase fw-7 fs-24"
                onClick={() => window.location.reload()}
              >
                Osvezi
              </div>
            </li>
            {items()}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
