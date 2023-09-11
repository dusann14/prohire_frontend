import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import Loader from "../components/Loader";
import ApplicationList from "../components/ApplicationList";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ApplicationListPage() {
  let navigate = useNavigate();
  const [appplicationList, setApplicationList] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));

  async function getApplications() {
    var config = {
      method: "get",
      url: "http://127.0.0.1:8080/api/application/employer?id=" + user.id,
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
      var response = await getApplications();

      if (response !== undefined && response.status === 200) {
        setApplicationList(response.data);
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

    if (user.appUserRole === "EMPLOYER") {
      alert("Nemate pristup ovoj stranici");
      navigate("/");
    } else fetchData();
  }, []);

  function applications() {
    if (appplicationList == null || appplicationList.length === 0)
      return (
        <div>
          <br />
          <Loader></Loader>
        </div>
      );
    else
      return (
        <ApplicationList
          applications={appplicationList}
          showUserDetails={false}
        ></ApplicationList>
      );
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
          Moje prijave za posao
        </p>
        {applications()}
      </div>
    </div>
  );
}

export default ApplicationListPage;
