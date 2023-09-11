import { React, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function RegistrationPage() {
  const [name, setName] = useState("");
  const [lastName, setLastNmae] = useState("");
  const [email, setEmail] = useState("");

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = JSON.stringify({
      firstName: name,
      lastName: lastName,
      email: email,
      appUserRole: sessionStorage.getItem("user"),
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://127.0.0.1:8080/api/auth/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 201) {
          alert("Uspesno ste se registrovali");
          sessionStorage.setItem("token", response.data.token);
          navigate("/confirm");
        }
      })
      .catch(function (error) {
        if (error.code === "ERR_NETWORK") {
          alert("Greska sa mrezom");
        } else if (error.response.status === 400) {
          alert(error.response.data.message);
        } else if (error.response.status === 500) {
          alert(error.response.data.message);
        }
      });
  };

  function page() {
    if (sessionStorage.getItem("user") === "JOB_SEEKER")
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
              <h2>Registrujte se</h2>
              <br />
              <form onSubmit={handleSubmit}>
                <input
                  name="name"
                  required
                  id="name"
                  placeholder="Vaše ime"
                  className="login-input"
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  name="lastName"
                  required
                  className="login-input"
                  id="lastName"
                  placeholder="Vaše prezime"
                  onChange={(e) => setLastNmae(e.target.value)}
                />
                <input
                  name="email"
                  id="email"
                  className="login-input"
                  type="email"
                  placeholder="Email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="login-button">
                  Registrujte se
                </button>
              </form>
            </div>
            <div className="signup-link">
              Imate nalog? <Link to="/login">Prijavite se!</Link>
            </div>
          </div>
        </div>
      );
    else
      return (
        <div
          className="login-page"
          style={{
            backgroundColor: "#00308F",
          }}
        >
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
              <h2>Registrujte se</h2>
              <div className="signup-link">
                Imate nalog? <Link to="/login">Prijavite se!</Link>
              </div>
              <form onSubmit={handleSubmit}>
                <p
                  style={{ float: "left", fontSize: "20px", marginTop: "10px" }}
                >
                  Licni podaci
                </p>
                <br />
                <hr />
                <input
                  name="name"
                  required
                  id="name"
                  placeholder="Ime"
                  className="login-input"
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  name="lastName"
                  required
                  className="login-input"
                  id="lastName"
                  placeholder="Prezime"
                  onChange={(e) => setLastNmae(e.target.value)}
                />
                <p
                  style={{ float: "left", fontSize: "20px", marginTop: "10px" }}
                >
                  Podaci za pristup
                </p>
                <br />
                <br />
                <hr />
                <input
                  name="email"
                  id="email"
                  className="login-input"
                  type="email"
                  placeholder="Email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button type="submit" className="login-button">
                  Registrujte se
                </button>
              </form>
            </div>
          </div>
        </div>
      );
  }

  return page();
}

export default RegistrationPage;
