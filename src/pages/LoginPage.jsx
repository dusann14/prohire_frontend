import { React, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../style/LoginRegistrationPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [job, setJob] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("job") !== null)
      setJob(sessionStorage.getItem("job"));

    if (sessionStorage.length > 0) {
      sessionStorage.clear();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    var data = new FormData();
    data.append("email", email);
    data.append("password", password);

    var config = {
      method: "post",
      url: "http://127.0.0.1:8080/api/auth/authenticate",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          alert("Uspesno ste se prijavili");
          sessionStorage.setItem("user", JSON.stringify(response.data));
        }

        if (job == "") navigate("/home");
        else navigate(`/application/${job}`);
      })
      .catch(function (error) {
        if (error.code === "ERR_NETWORK") {
          alert("Greska sa mrezom");
        } else if (error.response.status === 401) {
          alert(error.response.data.message);
        } else if (error.response.status === 400) {
          alert(error.response.data.message);
        }
      });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2
            onClick={() => {
              navigate("/home");
            }}
            style={{ cursor: "pointer" }}
          >
            ProHire
          </h2>
          <img src="6956765.png" alt="" />
        </div>
        <div className="login-form">
          <h2>Prijavite se</h2>
          <br />
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              id="user"
              type="email"
              required
              placeholder="Vaš email"
              className="login-input"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Lozinka"
              className="login-input"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="login-button">
              Prijavite se
            </button>
          </form>
        </div>
        <div className="signup-link">
          Nemate nalog? Registrujte se kao{" "}
          <Link
            to="/register"
            onClick={() => {
              sessionStorage.setItem("user", "JOB_SEEKER");
            }}
          >
            kandidat
          </Link>
          ,{" "}
          <Link
            to="/register"
            onClick={() => {
              sessionStorage.setItem("user", "EMPLOYER");
            }}
          >
            poslodavac
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
