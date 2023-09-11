import { PayPalButtons } from "@paypal/react-paypal-js";
import "../style/PayPal.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PayPalPayment = ({ postJob }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: "2.00",
            },
          },
        ],
      })
      .catch(function (error) {
        console.error("Error creating order:", error);
      });
  };

  const onApprove = (data, actions) => {
    return actions.order
      .capture()
      .then(function (details) {
        setPaymentStatus("success");
        postJob();
      })
      .catch(function (error) {
        setPaymentStatus("error");
      });
  };

  return (
    <div className="login-page">
      <div className="paypal-container">
        <div className="text">
          Dobrodosli na ProHire stranicu za plaćanje. Cena objave posla je 2$.
        </div>
        <PayPalButtons
          createOrder={(data, actions) => createOrder(data, actions)}
          onApprove={(data, actions) => onApprove(data, actions)}
          style={{
            label: "pay",
            shape: "pill",
          }}
        />
        {paymentStatus === "success" && (
          <div className="success-message">Uspesno placanje!</div>
        )}
        {paymentStatus === "error" && (
          <div className="error-message">
            Neuspesno placanje! Molimo pokusajte kasnije, hvala.
          </div>
        )}
      </div>
    </div>
  );
};

export default PayPalPayment;
