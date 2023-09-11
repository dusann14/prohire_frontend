import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PayPalPayment from "../components/PayPalPayment";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const initialOptions = {
  clientId:
    "AcA9x-U6efCsIkHAT1ziE99RsHCj8bArhcYmk3ajvr6NXC2sTdlRj2_euDu6kLRqcQhsK2mp-CzHARIi",
  currency: "USD",
  intent: "capture",
};

function PayPalPage() {
  var user = JSON.parse(sessionStorage.getItem("user"));

  const location = useLocation();
  let data;

  let navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("user") === null) {
      navigate("/login");
      return;
    }

    if (user.appUserRole === "JOB_SEEKER") {
      alert("Nemate pristup ovoj stranici");
      navigate(-1);
    }

    data = location.state;
  }, []);

  function postJob() {
    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://127.0.0.1:8080/api/job/post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 201) {
          alert("Uspesno ste se objavili posao");
          navigate("/job/post");
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
          navigate("/job/post");
        } else if (error.response.status === 401) {
          alert(error.response.data.message);
          navigate("/login");
        }
      });
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalPayment postJob={postJob}></PayPalPayment>
    </PayPalScriptProvider>
  );
}

export default PayPalPage;
