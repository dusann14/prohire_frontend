import { React, useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import Table from "../components/Table";
import JobList from "../components/JobList";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

function HomePage() {
  const [numberOfJobs, setNumberOfJobs] = useState();
  const [employers, setEmployers] = useState();
  const [jobList, setJobList] = useState([]);
  const [dayCriteria, setDayCriteria] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(8);

  let navigate = useNavigate();

  async function countJobs() {
    var config = {
      method: "get",
      url: "http://127.0.0.1:8080/api/job/count",
      headers: {},
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

  async function countEmployers() {
    var config = {
      method: "get",
      url: "http://127.0.0.1:8080/api/employer/count",
      headers: {},
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

  async function getAllJobs() {
    var config = {
      method: "get",
      url: "http://127.0.0.1:8080/api/job/all",
      headers: {},
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

  function findJobsByDay() {
    var config = {
      method: "get",
      url: "http://127.0.0.1:8080/api/job/posted_date?date=" + dayCriteria,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setJobList(response.data);
        }
      })
      .catch(function (error) {
        if (error.code === "ERR_NETWORK") {
          alert("Greska sa mrezom");
        }
      });
  }

  function searchByMultipleCriteria(text, selectedCity, selectedWorkField) {
    console.log(text);
    console.log(selectedCity);
    console.log(selectedWorkField);
    let textPart = text ? `?text=${text}` : "";
    let cityPart = "";
    let workFieldPart = "";

    if (text && selectedCity) cityPart = `&cityId=${selectedCity.id}`;
    else if (text === "" && selectedCity)
      cityPart = `?cityId=${selectedCity.id}`;

    if (selectedWorkField && selectedCity)
      workFieldPart = `&workFieldId=${selectedWorkField.id}`;
    if (selectedWorkField && text !== "")
      workFieldPart = `&workFieldId=${selectedWorkField.id}`;
    else if (selectedCity === null && selectedWorkField && text === "")
      workFieldPart = `?workFieldId=${selectedWorkField.id}`;

    let url =
      "http://127.0.0.1:8080/api/job/search" +
      textPart +
      cityPart +
      workFieldPart;

    var config = {
      method: "get",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setJobList(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
        if (error.code === "ERR_NETWORK") {
          alert("Greska sa mrezom");
        }
      });
    setCurrentPage(1);
  }

  useEffect(() => {
    if (dayCriteria !== null) findJobsByDay();
  }, [dayCriteria]);

  useEffect(() => {
    async function fetchData() {
      var response = await countJobs();

      if (response !== undefined && response.status === 200) {
        setNumberOfJobs(response.data);
      } else if (response !== undefined && response.status === 401) {
        alert(response.data.message);
        navigate("/login");
      }

      response = await countEmployers();

      if (response !== undefined && response.status === 200) {
        setEmployers(response.data);
      } else if (response !== undefined && response.status === 401) {
        alert(response.data.message);
        navigate("/login");
      }

      response = await getAllJobs();

      if (response !== undefined && response.status === 200) {
        setJobList(response.data);
      } else if (response !== undefined && response.status === 401) {
        alert(response.data.message);
        navigate("/login");
      }
    }
    fetchData();
  }, []);

  if (
    sessionStorage.getItem("user") === "EMPLOYER" ||
    sessionStorage.getItem("user") === "JOB_SEEKER"
  )
    sessionStorage.clear();

  function jobs() {
    if (jobList == null || jobList.length === 0)
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ marginTop: "50px" }}>
            Trenutno nema rezultata za ovu pretragu
          </div>
        </div>
      );

    const lastJobIndex = currentPage * jobsPerPage;
    const firstJobIndex = lastJobIndex - jobsPerPage;
    const currentJobs = jobList.slice(firstJobIndex, lastJobIndex);

    return <JobList jobs={currentJobs}></JobList>;
  }

  function numberOfResults() {
    if (jobList == null || jobList.length === 0) return;
    else
      return (
        <p
          className="text-uppercase fw-6 fs-24"
          style={{
            fontFamily: "Oswald",
          }}
        >
          {jobList.length} rezultata pretrage
        </p>
      );
  }

  return (
    <div className="homePage">
      <Navbar></Navbar>
      <div class="section1">
        <p
          className="text-uppercase fw-8 fs-26"
          style={{ fontFamily: "Caprasimo" }}
        >
          Najveći broj oglasa za posao na jednom mestu.
        </p>
        <p
          className="text-uppercase fw-6 fs-24"
          style={{ fontFamily: "Oswald" }}
        >
          {numberOfJobs} oglasa za posao, {employers} kompanija
        </p>
        <br />
        <br />
        <Table search={searchByMultipleCriteria}></Table>
        {numberOfResults()}
        <p
          className="text-uppercase fw-6 fs-24"
          style={{ fontFamily: "Oswald", marginTop: "3%" }}
        >
          Najnoviji oglasi
        </p>
        <br />
        <div className="buttons" style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={() => {
              setDayCriteria("today");
            }}
          >
            danas
          </button>
          <button
            onClick={() => {
              setDayCriteria(2);
            }}
          >
            poslednja 2 dana
          </button>
          <button
            onClick={() => {
              setDayCriteria(3);
            }}
          >
            poslednja 3 dana
          </button>
          <button
            onClick={() => {
              setDayCriteria(7);
            }}
          >
            poslednjih 7 dana
          </button>
        </div>
      </div>
      <div style={{ backgroundColor: "#f4f5f7" }}>{jobs()}</div>
      <div style={{ padding: "2%" }}>
        <Pagination
          totalJobs={jobList.length}
          jobsPerPage={jobsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

export default HomePage;
