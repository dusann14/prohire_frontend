import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function CongratulationPage() {
  let navigate = useNavigate();
  const { token } = useParams();

  function handleContinue(e) {
    e.preventDefault();

    var config = {
      method: "get",
      url: "http://localhost:8080/api/auth/confirm?token=" + token,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          sessionStorage.setItem("user", JSON.stringify(response.data));
          navigate("/register/continue");
        }
      })
      .catch(function (error) {
        if (error.code === "ERR_NETWORK") {
          alert("Greska sa mrezom");
          navigate("/login");
        } else if (error.response.status === 400) {
          alert(error.response.data.message);
          navigate("/login");
        }
      });
  }

  return (
    <div className="login-page">
      <div class="conformation_container">
        <i class="uil uil-times form_close"></i>
        <div className="orange_section">ProHire</div>
        <div className="text_container">
          <p>
            Čestitamo upravo ste postali član našeg tima. Kliknite na dugme
            ispod i nastavite proces registracije!
          </p>
          <button onClick={(e) => handleContinue(e)} className="login-button">
            Nastavi proces registracije!
          </button>
        </div>
      </div>
    </div>
  );
}

export default CongratulationPage;
