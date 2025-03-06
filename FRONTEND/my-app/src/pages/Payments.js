import axios from "axios";
import { useEffect, useState } from "react";

const Payment = ({ bookingId }) => {
  const [razorpayKey, setRazorpayKey] = useState("");

  useEffect(() => {
    // Fetch Razorpay Key from Backend
    const fetchKey = async () => {
      try {
        const res = await axios.get("/api/payments/razorpay-key/");
        setRazorpayKey(res.data.key);
      } catch (error) {
        console.error("Error fetching Razorpay key", error);
      }
    };
    fetchKey();
  }, []);

  const handlePayment = async () => {
    try {
      const response = await axios.post(`/api/payments/create-order/${bookingId}/`);
      const { order_id, amount } = response.data;

      const options = {
        key: razorpayKey, // Use dynamic key from backend
        amount: amount,
        currency: "INR",
        name: "Your Company",
        order_id: order_id,
        handler: async function (response) {
          const verifyResponse = await axios.post("/api/payments/verify-payment/", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyResponse.data.status === "Payment Successful") {
            alert("Payment Successful!");
          } else {
            alert("Payment Failed!");
          }
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error processing payment", error);
    }
  };

  return (
    <button onClick={handlePayment} className="btn btn-primary" disabled={!razorpayKey}>
      Pay Now
    </button>
  );
};

export default Payment;
