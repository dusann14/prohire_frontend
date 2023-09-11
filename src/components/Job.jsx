import React from "react";
import "../style/Job.css";
import { FiClock } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { BsTrash3Fill } from "react-icons/bs";

const Job = ({ job }) => {
  let navigate = useNavigate();

  var user = JSON.parse(sessionStorage.getItem("user"));

  function handleNavigate() {
    navigate(`/job/${job.jobTitle}/${job.employerDTO.companyName}/${job.id}`);
  }

  function formatDate(dateArray) {
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
  }

  function button() {
    if (user !== null && job.employerDTO.id == user.id) {
      return (
        <div className="icon-div">
          <div
            className="buttons"
            style={{
              padding: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              style={{
                marginTop: "20px",
                backgroundColor: "#E0115F",
                color: "white",
              }}
              onClick={(e) => navigate(`/applications/job/${job.id}`)}
            >
              Vidi prijave
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="job-card">
      <h2 className="job-title" onClick={handleNavigate}>
        {job.jobTitle}
      </h2>
      <p className="company">{job.employerDTO.companyName}</p>
      <p className="description">{job.briefDescription}</p>
      <div className="icon-div">
        <CiLocationOn />
        <p className="location">{job.employerDTO.cityDTO.name}</p>
      </div>
      <div className="icon-div">
        <FiClock />
        <p>{formatDate(job.expirationDate)}</p>
      </div>
      {button()}
    </div>
  );
};

export default Job;
