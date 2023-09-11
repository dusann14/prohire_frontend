import { React, useState, useEffect } from "react";
import "../style/Table.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

function Table({ search }) {
  const [cities, setCities] = useState([]);
  const [workFields, setWorkFields] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedWorkField, setSelectedWorkField] = useState(null);
  const [text, setText] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      var response = await getAllCities();

      if (response !== undefined && response.status === 200) {
        const formattedCities = formatDataForSelect(response.data);
        setCities(formattedCities);
      } else if (response !== undefined && response.status === 401) {
        alert(response.data.message);
        navigate("/login");
      }

      response = await getAllWorkFields();

      if (response !== undefined && response.status === 200) {
        const formattedWorkFields = formatDataForSelect(response.data);
        setWorkFields(formattedWorkFields);
      } else if (response !== undefined && response.status === 401) {
        alert(response.data.message);
        navigate("/login");
      }
    }
    fetchData();
  }, []);

  const formatDataForSelect = (data) => {
    return data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  };

  return (
    <div className="rounded-table">
      <div className="rounded-row">
        <input
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="Pozicija ili poslodavac"
          className="rounded-cell text-uppercase fw-8 fs-18"
          style={{ fontFamily: "Oswald" }}
        />
        <div className="rounded-cell">
          <Select
            onChange={(e) => {
              var city = { id: e.value, name: e.label };
              setSelectedCity(city);
            }}
            options={cities}
            placeholder="Grad"
          />
        </div>

        <div className="rounded-cell">
          <Select
            onChange={(e) => {
              var workfield = { id: e.value, name: e.label };
              setSelectedWorkField(workfield);
            }}
            options={workFields}
            placeholder="Oblast rada"
          />
        </div>
        <button
          onClick={() => {
            search(text, selectedCity, selectedWorkField);
          }}
          className="rounded-cell search-button"
        >
          <FaSearch></FaSearch>
        </button>
      </div>
    </div>
  );
}

async function getAllCities() {
  var config = {
    method: "get",
    url: "http://127.0.0.1:8080/api/city/all",
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

async function getAllWorkFields() {
  var config = {
    method: "get",
    url: "http://127.0.0.1:8080/api/workfield/all",
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

export default Table;
