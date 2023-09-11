import React from "react";
import "../style/Job.css";
import { FiClock } from "react-icons/fi";
import { BiSolidCalendar } from "react-icons/bi";
import { AiFillFilePdf } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Application = ({ application, showUserDetails }) => {
  let navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));

  const downloadFile = (e) => {
    e.preventDefault();

    var config = {
      method: "get",
      url: application.resumeDTO.url,
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
        anchor.download = application.resumeDTO.name;
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

  function formatDate(dateArray) {
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
  }

  function defineApplication() {
    if (!showUserDetails)
      return (
        <div className="application-card">
          <h2
            className="job-title"
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(
                `/job/${application.jobDTO.jobTitle}/${application.jobDTO.employerDTO.companyName}/${application.jobDTO.id}`
              )
            }
          >
            {application.jobDTO.jobTitle}
          </h2>
          <p className="company">
            {application.jobDTO.employerDTO.companyName}
          </p>
          <p className="description">{application.jobDTO.briefDescription}</p>
          <div className="icon-div">
            <p style={{ fontWeight: "bold" }}>Poslata biografija(CV):</p>
            <AiFillFilePdf></AiFillFilePdf>
            <p style={{ cursor: "pointer" }} onClick={downloadFile}>
              {application.resumeDTO.name}
            </p>
          </div>
          <div className="icon-div">
            <p style={{ fontWeight: "bold" }}>Datum prijave:</p>
            <BiSolidCalendar></BiSolidCalendar>
            <p>{formatDate(application.applicationDate)}</p>
          </div>
          <div className="icon-div">
            <p style={{ fontWeight: "bold" }}>Konkurs ističe:</p>
            <FiClock />
            <p>{formatDate(application.jobDTO.expirationDate)}</p>
          </div>
        </div>
      );
    else
      return (
        <div className="application-card">
          <h2 className="job-title" style={{ cursor: "pointer" }}>
            {application.jobSeekerDTO.appUserDTO.firstName}{" "}
            {application.jobSeekerDTO.appUserDTO.lastName}
          </h2>
          <p className="company">{application.jobSeekerDTO.appUserDTO.email}</p>
          <div className="icon-div">
            <p style={{ fontWeight: "bold" }}>Poslata biografija(CV):</p>
            <AiFillFilePdf></AiFillFilePdf>
            <p style={{ cursor: "pointer" }} onClick={downloadFile}>
              {application.resumeDTO.name}
            </p>
          </div>
          <div className="icon-div">
            <p style={{ fontWeight: "bold" }}>Datum prijave:</p>
            <BiSolidCalendar></BiSolidCalendar>
            <p>{formatDate(application.applicationDate)}</p>
          </div>
          <div className="icon-div">
            <p style={{ fontWeight: "bold" }}>Konkurs ističe:</p>
            <FiClock />
            <p>{formatDate(application.jobDTO.expirationDate)}</p>
          </div>
        </div>
      );
  }

  return defineApplication();
};

export default Application;
