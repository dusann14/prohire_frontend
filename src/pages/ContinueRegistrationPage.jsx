import { React, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

function ContinueRegistrationPage() {
  const [companyName, setCompanyName] = useState("");
  const [PIB, setPIB] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeateedPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [cities, setCities] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [industry, setIndustry] = useState(null);
  const [city, setCity] = useState(null);

  let navigate = useNavigate();

  var user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (user === null) {
      alert("Niste zavrsili prvi korak registracije");
      navigate("/login");
    }

    async function fetchData() {
      var response = await getAllCities();
      if (response.status === 200) {
        const formattedCities = formatDataForSelect(response.data);
        setCities(formattedCities);
      }

      response = await getAllIndustries();

      if (response.status === 200) {
        const formattedIndustries = formatDataForSelect(response.data);
        setIndustries(formattedIndustries);
      }
    }
    if (user !== null && user.appUserDTO.appUserRole === "EMPLOYER") {
      fetchData();
    }
  }, []);

  const formatDataForSelect = (data) => {
    return data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== repeatedPassword) {
      alert("Lozinke koje ste uneli se ne poklapaju");
      return;
    }

    let data = JSON.stringify({
      id: user.appUserDTO.id,
      password: password,
      companyName: companyName,
      PIB: PIB,
      number: number,
      industry: industry,
      phoneNumber: phoneNumber,
      postalCode: postalCode,
      city: city,
    });

    var config = {
      method: "put",
      maxBodyLength: Infinity,
      url: "http://127.0.0.1:8080/api/auth",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          alert("Uspesno ste završili proces registracije. Prijavite se");
          navigate("/login");
        }
      })
      .catch(function (error) {
        if (error.code === "ERR_NETWORK") {
          alert("Greska sa mrezom");
        } else if (error.response.status === 400) {
          alert(error.response.data.message);
        }
      });
  };

  function page() {
    if (user === null) return;

    if (user.appUserDTO.appUserRole === "JOB_SEEKER")
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
              <img src="/6956765.png" alt="" />
            </div>
            <div className="login-form">
              <h2>Registrujte se</h2>
              <br />
              <form onSubmit={handleSubmit}>
                <input
                  name="password"
                  id="password"
                  className="login-input"
                  type="password"
                  placeholder="Lozinka"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  name="repeatedPassword"
                  id="repeatedPassword"
                  className="login-input"
                  type="password"
                  placeholder="Ponovite lozinku"
                  required
                  onChange={(e) => setRepeateedPassword(e.target.value)}
                />

                <button type="submit" className="login-button">
                  Završite registraciju
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
              <img src="/6956765.png" alt="" />
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
                  Podaci o kompaniji
                </p>
                <br />
                <hr />
                <input
                  name="companyName"
                  id="companyName"
                  className="login-input"
                  placeholder="Ime kompanije"
                  required
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <input
                  name="number"
                  id="number"
                  className="login-input"
                  placeholder="Maticni broj"
                  required
                  onChange={(e) => setNumber(e.target.value)}
                />
                <input
                  name="PIB"
                  id="PIB"
                  className="login-input"
                  placeholder="PIB"
                  required
                  onChange={(e) => setPIB(e.target.value)}
                />
                <Select
                  onChange={(e) => {
                    var industry = { id: e.value, name: e.label };
                    setIndustry(industry);
                  }}
                  required
                  options={industries}
                  placeholder="Industrija"
                />
                <br />
                <input
                  name="phoneNumber"
                  id="phoneNumber"
                  className="login-input"
                  placeholder="Telefon kompanije"
                  required
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                  name="postalCode"
                  id="postalCode"
                  className="login-input"
                  placeholder="Postanski broj"
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                <br />
                <Select
                  onChange={(e) => {
                    var city = { id: e.value, name: e.label };
                    setCity(city);
                  }}
                  required
                  options={cities}
                  placeholder="Grad"
                />
                <p
                  style={{ float: "left", fontSize: "20px", marginTop: "10px" }}
                >
                  Podaci za pristup
                </p>
                <br />
                <hr />
                <input
                  name="password"
                  id="password"
                  className="login-input"
                  type="password"
                  placeholder="Lozinka"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  name="repeatedPassword"
                  id="repeatedPassword"
                  className="login-input"
                  type="password"
                  placeholder="Ponovite lozinku"
                  required
                  onChange={(e) => setRepeateedPassword(e.target.value)}
                />
                <button type="submit" className="login-button">
                  Završite registraciju
                </button>
              </form>
            </div>
          </div>
        </div>
      );
  }

  return page();
}

async function getAllCities() {
  var config = {
    method: "get",
    url: "http://127.0.0.1:8080/api/city/all",
    headers: {},
  };

  let res = axios(config)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });

  return res;
}

async function getAllIndustries() {
  var config = {
    method: "get",
    url: "http://127.0.0.1:8080/api/industry/all",
    headers: {},
  };

  let res = axios(config)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });

  return res;
}

export default ContinueRegistrationPage;
