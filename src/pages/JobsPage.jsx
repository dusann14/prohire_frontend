import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import JobList from "../components/JobList";
import axios from "axios";
import Loader from "../components/Loader";

function JobsPage() {
  let navigate = useNavigate();
  const [jobList, setJobList] = useState([]);

  var user = JSON.parse(sessionStorage.getItem("user"));

  async function getJobs() {
    var config = {
      method: "get",
      url: "http://127.0.0.1:8080/api/job/employer?id=" + user.id,
      headers: {
        Authorization: `Bearer ${user.token}`,
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
    async function fetchData() {
      var response = await getJobs();

      if (response !== undefined && response.status === 200) {
        setJobList(response.data);
      } else if (response !== undefined && response.status === 401) {
        alert(response.data.message);
        navigate("/login");
      } else if (response !== undefined && response.status === 403) {
        alert("Nemate pravo na ovu rutu");
        navigate("/login");
      }
    }

    if (sessionStorage.getItem("user") === null) {
      navigate("/login");
      return;
    }

    if (user.appUserRole === "JOB_SEEKER") {
      alert("Nemate pristup ovoj stranici");
      navigate("/");
    } else fetchData();
  }, []);

  function jobs() {
    if (jobList == null || jobList.length === 0)
      return (
        <div>
          <br />
          <Loader></Loader>
        </div>
      );
    else return <JobList jobs={jobList}></JobList>;
  }

  return (
    <div className="login-page" style={{ display: "block" }}>
      <Navbar></Navbar>
      <div style={{ paddingTop: "100px" }}>
        <br />
        <p
          style={{
            textAlign: "center",
            fontFamily: "Cambria",
            fontWeight: "bold",
            fontSize: "4rem",
          }}
        >
          Objavljeni poslovi
        </p>
        {jobs()}
      </div>
    </div>
  );
}

export default JobsPage;
