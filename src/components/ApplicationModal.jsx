import React from "react";
import "../style/Modal.css";
import { GrAttachment } from "react-icons/gr";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ApplicationModal({ displayedJob, selectedFile, closeModal }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  let navigate = useNavigate();

  const handleApplication = (e) => {
    e.preventDefault();

    var data = new FormData();
    data.append("jobSeekerDTO", JSON.stringify({ id: user.id }));
    data.append("jobDTO", JSON.stringify({ id: displayedJob.id }));

    if (selectedFile.id !== undefined) {
      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://127.0.0.1:8080/api/application/post/profile",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
        data: data,
      };
    } else {
      data.append("resumeDTO", JSON.stringify({ name: selectedFile.name }));
      data.append("cvFile", selectedFile);

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://127.0.0.1:8080/api/application/post/file",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
        data: data,
      };
    }

    axios(config)
      .then(function (response) {
        if (response.status === 201) {
          alert("Uspešno ste konkurisali za posao");
          closeModal();
        }
      })
      .catch(function (error) {
        if (error.code === "ERR_NETWORK") {
          alert("Greska sa mrezom");
        } else if (error.response.status === 403) {
          alert("Nemate pravo na ovu rutu");
          //   navigate("/login");
        } else if (error.response.status === 400) {
          alert(error.response.data.message);
        } else if (error.response.status === 401) {
          alert(error.response.data.message);
          navigate("/login");
        }
      });
  };

  return (
    <div className="modal">
      <p
        style={{ fontWeight: "bold", textAlign: "center", fontSize: "2.5rem" }}
      >
        Pregled prijave
      </p>
      <hr />
      <br />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontWeight: "bold" }}>Vaši podaci:</p>
          <p>
            Ime i prezime: {user.firstName} {user.lastName}
          </p>
          <p>Email: {user.email}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontWeight: "bold" }}>Konkurs:</p>
          <p>{displayedJob.jobTitle}</p>
          <p>{displayedJob.employerDTO.companyName}</p>
        </div>
      </div>
      <br />
      <hr />
      <br />
      <div className="cv">
        <GrAttachment></GrAttachment>
        <p>Biografija: {selectedFile.name}</p>
      </div>
      <br />
      <hr />
      <br />
      <div
        className="buttons"
        style={{
          display: "flex",
          padding: "5px",
          gap: "10px",
          justifyContent: "right",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleApplication}
          style={{
            backgroundColor: "#E0115F",
            color: "white",
          }}
        >
          Konkuriši
        </button>
        <button onClick={closeModal}>Nazad</button>
      </div>
    </div>
  );
}

export default ApplicationModal;
