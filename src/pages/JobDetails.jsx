import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { FiClock } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import "../style/JobDetails.css";
import axios from "axios";
import Loader from "../components/Loader.jsx";

function JobDetails() {
  const [displayedJob, setDisplayedJob] = useState(null);

  const { jobTitle, companyName, id } = useParams();
  const navigate = useNavigate();

  function formatDate(dateArray) {
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
  }

  async function getJob() {
    var config = {
      method: "get",
      url: "http://127.0.0.1:8080/api/job/find?id=" + id,
      headers: {
        "Content-Type": "application/json",
      },
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
    if (sessionStorage.length == 0) {
      sessionStorage.setItem("job", `${id}`);
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

  function handleApply() {
    if (sessionStorage.length === 0) {
      navigate("/login");
    } else navigate(`/application/${id}`);
  }

  function displayJob() {
    if (displayedJob !== null)
      return (
        <div className="jobDetails-card" style={{ cursor: "default" }}>
          <h2 className="job-title">{displayedJob.jobTitle}</h2>
          <p className="company">{displayedJob.employerDTO.companyName}</p>
          <div className="icon-div">
            <CiLocationOn />
            <p className="location">{displayedJob.employerDTO.cityDTO.name}</p>
          </div>
          <div className="icon-div">
            <FiClock />
            <p>{formatDate(displayedJob.expirationDate)}</p>
          </div>
          <br />
          <p className="description" style={{ fontSize: "20px" }}>
            Tekst oglasa
          </p>
          <hr />
          <br />
          <p className="description" style={{ fontSize: "18px" }}>
            <div dangerouslySetInnerHTML={{ __html: displayedJob.text }} />
          </p>
          {button()}
        </div>
      );
    else return <Loader></Loader>;
  }

  return (
    <div className="jobDetails-div">
      <Navbar></Navbar>
      {displayJob()}
    </div>
  );

  function button() {
    var user = JSON.parse(sessionStorage.getItem("user"));
    if (user === null || user.appUserRole === "JOB_SEEKER") {
      return (
        <div>
          <br />
          <hr />
          <div className="buttons" style={{ padding: "5px" }}>
            <button
              onClick={handleApply}
              style={{
                marginTop: "30px",
                backgroundColor: "#E0115F",
                color: "white",
              }}
            >
              Konkurišite
            </button>
          </div>
        </div>
      );
    } else if (user.appUserRole === "EMPLOYER") {
      return;
    }
  }
}

export default JobDetails;
