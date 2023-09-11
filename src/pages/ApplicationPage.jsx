import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import "../style/Application.css";
import Loader from "../components/Loader";
import { FaUpload } from "react-icons/fa";
import Modal from "react-modal";
import ApplicationModal from "../components/ApplicationModal";

function ApplicationPage() {
  let navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [displayedJob, setDisplayedJob] = useState(null);
  const [isToggled, setIsToggled] = useState(false);
  const fileInputRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sentCV, setSentCV] = useState(null);

  const handleToggle = () => {
    setIsToggled((prevState) => !prevState);
    if (sentCV === null) setSentCV(user.resumeDTO);
    else setSentCV(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setSentCV(event.target.files[0]);
  };

  const handleFileDelete = () => {
    setSelectedFile(null);
    setSentCV(null);
  };

  const { id } = useParams();

  async function getJob() {
    var config = {
      method: "get",
      url: "http://127.0.0.1:8080/api/job/find?id=" + id,
      headers: {
        "Content-Type": "application/json",
      },
      data: id,
    };

    let res = axios(config)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error.response;
      });

    return res;
  }
  useEffect(() => {
    if (sessionStorage.getItem("user") === null) {
      navigate("/login");
      return;
    }

    if (user.appUserRole === "EMPLOYER") {
      alert("Nemate pristup ovoj stranici");
      navigate(-1);
    }
    async function fetchData() {
      var response = await getJob();

      if (response !== undefined && response.status === 200) {
        setDisplayedJob(response.data);
      } else if (response !== undefined && response.status === 401) {
        alert(response.data.message);
        navigate("/login");
      } else if (response !== undefined && response.status === 400) {
        alert(response.data.message);
        navigate("/home");
      }
    }
    fetchData();
  }, []);

  function fileOrButton() {
    if (selectedFile)
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "10%" }}>
          <FaUpload style={{ minWidth: "20%" }}></FaUpload>
          <span>{selectedFile.name}</span>
          <button onClick={handleFileDelete} className="button">
            X
          </button>
        </div>
      );
    else
      return (
        <button
          onClick={handleButtonClick}
          className={`button ${isToggled ? "disabled" : ""}`}
          disabled={isToggled}
        >
          + Dodajte biografiju (CV)
        </button>
      );
  }

  function allowToggle() {
    if (selectedFile !== null || user.resumeDTO === null) return true;
    return false;
  }

  function application() {
    if (displayedJob !== null) {
      return (
        <div className="page-container">
          <div className="content-container">
            <div className="job-header">
              <p>Prijava na konkurs</p>
              <p style={{ fontSize: "3.5rem" }}>{displayedJob.jobTitle}</p>
              <p>{displayedJob.employerDTO.companyName}</p>
            </div>
            <br />
            <hr />
            <br />
            <label>Lični podaci</label>
            <div className="personal-info">
              <p>
                Ime i prezime: {user.firstName} {user.lastName}
              </p>
              <p>Email: {user.email}</p>
            </div>
            <br />
            <hr />
            <br />
            <div>
              <div>
                <label>Način konkurisanja</label>
                <br />
                <div style={{ display: "flex", gap: "10px" }}>
                  <label className="switch">
                    <input
                      type="checkbox"
                      disabled={allowToggle()}
                      checked={isToggled}
                      onChange={handleToggle}
                    />
                    <span class="slider round"></span>
                  </label>
                  <label>Konkurisanje putem profila</label>
                </div>
                <br />
                <label>
                  Izmenite svoj <Link to="/profile">ProHire</Link> profil
                </label>
                <br />
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10%" }}
                >
                  <label>Vasa biografija (CV)</label>
                  {fileOrButton()}
                </div>
                <br />
                <hr />
                <div
                  className="buttons"
                  style={{
                    display: "flex",
                    padding: "5px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      if (selectedFile === null && !isToggled)
                        alert(
                          "Dodajte biografiju ili selektujte prijavljivanje pomoću profila"
                        );
                      else setModalOpen(true);
                    }}
                    style={{
                      marginTop: "30px",
                      backgroundColor: "#E0115F",
                      color: "white",
                    }}
                  >
                    Nastavite
                  </button>
                </div>
              </div>
            </div>
          </div>
          <input
            key={selectedFile ? selectedFile.name : "file-input"}
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            shouldCloseOnEsc={true}
            shouldCloseOnOverlayClick={true}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.60)",
              },
              content: {
                color: "#000",
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "60%",
                height: "60%",
                backgroundColor: "#fff",
                padding: "2rem",
              },
            }}
          >
            <ApplicationModal
              displayedJob={displayedJob}
              selectedFile={sentCV}
              closeModal={closeModal}
            ></ApplicationModal>
          </Modal>
        </div>
      );
    } else return <Loader></Loader>;
  }

  return (
    <div>
      <Navbar></Navbar>
      {application()}
    </div>
  );

  function closeModal() {
    setModalOpen(false);
  }
}

export default ApplicationPage;
