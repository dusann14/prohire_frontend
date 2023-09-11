import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../style/PostJob.css";
import { DatePicker } from "antd";
import axios from "axios";
import Select from "react-select";

function PostJob() {
  let navigate = useNavigate();
  const [workFields, setWorkFields] = useState([]);
  const [selectedWorkField, setSelectedWorkField] = useState(null);
  const [quillValue, setQuillValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    async function fetchData() {
      var response = await getAllWorkFields();

      if (response.status === 200) {
        const formattedWorkFields = formatDataForSelect(response.data);
        setWorkFields(formattedWorkFields);
      } else if (response.status === 401) {
        alert(response.data.message);
        navigate("/login");
      }
    }

    if (sessionStorage.getItem("user") === null) {
      navigate("/login");
      return;
    }

    if (user.appUserRole === "JOB_SEEKER") {
      alert("Nemate pristup ovoj stranici");
      navigate(-1);
    } else fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    let data = JSON.stringify({
      text: quillValue,
      jobTitle: title,
      briefDescription: description,
      postedDate: new Date(),
      expirationDate: selectedDate,
      employerDTO: {
        id: user.id,
      },
      workFieldDTO: selectedWorkField,
    });

    navigate("/paypal", { state: data });
  };

  const formatDataForSelect = (data) => {
    return data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="page-container">
        <div className="content-container">
          <div className="modern-input">
            <label>Naziv radnog mesta</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="modern-input">
            <label>Kratki opis</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="modern-input">
            <label>Datum isteka oglasa</label>
            <DatePicker
              onChange={(e) => {
                setSelectedDate(e);
              }}
              placeholder="Datum"
              required
              className="datepicker"
            />
          </div>
          <div className="modern-input">
            <label>Oblast rada</label>
            <Select
              onChange={(e) => {
                var workField = {
                  id: e.value,
                  name: e.label,
                };
                setSelectedWorkField(workField);
              }}
              options={workFields}
              placeholder="Oblast rada"
              required
            />
          </div>
          <div className="modern-input">
            <label>Teks oglasa</label>
            <ReactQuill
              value={quillValue}
              required
              onChange={(content) => {
                setQuillValue(content);
              }}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [
                    {
                      font: [],
                    },
                  ],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ align: [] }],
                  ["link", "image", "video"],
                  ["clean"],
                ],
              }}
            />
          </div>
          <div className="buttons" style={{ padding: "5px" }}>
            <button
              style={{
                marginTop: "30px",
                backgroundColor: "#E0115F",
                color: "white",
              }}
              onClick={(e) => {
                if (
                  !title ||
                  !description ||
                  !selectedDate ||
                  !selectedWorkField ||
                  !quillValue
                ) {
                  alert("Popunite sva polja");
                } else {
                  handleSubmit(e);
                }
              }}
            >
              Objavi posao
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
        return error;
      });

    return res;
  }
}

export default PostJob;
