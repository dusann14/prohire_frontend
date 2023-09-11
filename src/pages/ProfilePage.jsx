import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/NavBar";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillFilePdf } from "react-icons/ai";

function ProfilePage() {
  var user = JSON.parse(sessionStorage.getItem("user"));

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  let navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("user") === null) {
      navigate("/login");
      return;
    }

    if (user.appUserRole === "EMPLOYER") {
      alert("Nemate pristup ovoj stranici");
      navigate("/");
    }
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileDelete = () => {
    setSelectedFile(null);
  };

  function handleUpdate(e) {
    e.preventDefault();

    let resumeId;

    if (user.resumeDTO === null) resumeId = 0;
    else resumeId = user.resumeDTO.id;

    var data = new FormData();
    data.append(
      "resumeDTO",
      JSON.stringify({ id: resumeId, name: selectedFile.name })
    );
    data.append("jobSeekerDTO", JSON.stringify({ id: user.id }));
    data.append("cvFile", selectedFile);

    var config = {
      method: "put",
      maxBodyLength: Infinity,
      url: "http://127.0.0.1:8080/api/resume",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user.token}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          alert("Uspešno ste dodali rezime");
          user.resumeDTO = response.data;
          sessionStorage.setItem("user", JSON.stringify(user));
          setSelectedFile(null);
        }
      })
      .catch(function (error) {
        if (error.code === "ERR_NETWORK") {
          alert("Greska sa mrezom");
        } else if (error.response.status === 403) {
          alert("Nemate pravo na ovu rutu");
          navigate("/login");
        } else if (error.response.status === 400) {
          alert(error.response.data.message);
        } else if (error.response.status === 401) {
          alert(error.response.data.message);
          navigate("/login");
        }
      });
  }

  const downloadFile = (e) => {
    e.preventDefault();

    var config = {
      method: "get",
      url: user.resumeDTO.url,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios(config)
      .then(function (response) {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        const downloadUrl = URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = user.resumeDTO.name;
        anchor.click();

        URL.revokeObjectURL(downloadUrl);
        anchor.remove();
      })
      .catch(function (error) {
        if (error.code === "ERR_NETWORK") {
          alert("Greska sa mrezom");
        } else if (error.response.status === 500) {
          alert("Greska sa serverom");
        }
      });
  };

  function cvOrNot() {
    if (user.resumeDTO !== null)
      return (
        <div className="icon-div">
          <p style={{ fontWeight: "bold" }}>Postavljena biografija(CV):</p>
          <AiFillFilePdf></AiFillFilePdf>
          <p style={{ cursor: "pointer" }} onClick={downloadFile}>
            {user.resumeDTO.name}
          </p>
        </div>
      );
    else if (user.resumeDTO === null && selectedFile === null)
      return (
        <button onClick={handleButtonClick} className="button">
          + Dodajte biografiju (CV)
        </button>
      );
  }

  function button() {
    if (user.resumeDTO !== null && selectedFile === null)
      return (
        <button onClick={handleButtonClick} className="button">
          + Izmenite biografiju (CV)
        </button>
      );
    else if (selectedFile !== null)
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <FaUpload></FaUpload>
          <span>{selectedFile.name}</span>
          <button onClick={handleFileDelete} className="button">
            X
          </button>
        </div>
      );
  }

  function page() {}

  return (
    <div>
      <Navbar></Navbar>

      <div className="page-container">
        <div className="content-container">
          <div className="modern-input">
            <label>Ime</label>
            <input type="text" readOnly placeholder={`${user.firstName}`} />
          </div>
          <div className="modern-input">
            <label>Prezime</label>
            <input type="text" readOnly placeholder={`${user.lastName}`} />
          </div>
          <div className="modern-input">
            <label>Email</label>
            <input type="text" readOnly placeholder={`${user.email}`} />
          </div>
          {cvOrNot()}
          <br />
          {button()}
          <div
            className="buttons"
            style={{
              padding: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              style={{
                marginTop: "20px",
                backgroundColor: "#E0115F",
                color: "white",
              }}
              onClick={(e) => handleUpdate(e)}
            >
              Sacuvaj promene
            </button>
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
    </div>
  );
}

export default ProfilePage;
