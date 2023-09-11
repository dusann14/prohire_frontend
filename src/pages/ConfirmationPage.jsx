import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ConfirmationPage() {
  const navigateToGmailInbox = () => {
    window.location.href = "https://mail.google.com/";
  };

  let navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token") === null) {
      alert("Nemate pristup ovoj stranici bez registracije");
      navigate("/login");
    }
  }, []);

  function page() {
    if (sessionStorage.getItem("token") === null) {
      return <div></div>;
    } else {
      return (
        <div className="login-page">
          <div class="conformation_container">
            <i class="uil uil-times form_close"></i>
            <div className="orange_section">ProHire</div>
            <div className="image_container">
              <img src="6956765.png" alt="" />
            </div>
            <div className="text_container">
              <p>
                Dobrodosli na ProHire. Pre nego da krenemo u zajednicke avanture
                , molimo Vas aktivirajte nalog. Poslali smo Vam mejl na Vašu
                mejl adresu.
              </p>
              <button onClick={navigateToGmailInbox} className="login-button">
                Aktiviraj nalog
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return page();
}

export default ConfirmationPage;
