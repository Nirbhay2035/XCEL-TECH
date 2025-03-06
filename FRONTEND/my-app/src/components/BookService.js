import { useState, useEffect } from "react";
import axios from "axios";

const BookService = ({ service }) => {
  const [bookingDate, setBookingDate] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleBookNow = async () => {
    if (!bookingDate) {
      alert("Please select a booking date.");
      return;
    }

    setIsBooking(true);

    try {
      // Create booking request
      const bookingResponse = await axios.post("http://127.0.0.1:8000/api/bookings/", {
        service_id: service.id,
        date: bookingDate,
      });

      const bookingId = bookingResponse.data.id;

      // Request backend to create a Razorpay order
      const paymentResponse = await axios.post(`http://127.0.0.1:8000/api/payments/create-order/${bookingId}/`);

      const { order_id, razorpay_key, amount } = paymentResponse.data;

      const options = {
        key: razorpay_key,
        amount: amount,
        currency: "INR",
        name: "Service Payment",
        description: service.name,
        order_id: order_id,
        handler: async (response) => {
          try {
            await axios.post("http://127.0.0.1:8000/api/payments/verify-payment/", response);
            alert("Payment Successful!");
          } catch (error) {
            alert("Payment Verification Failed!");
          }
        },
        prefill: {
          email: "user@example.com",
          contact: "9999999999",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
      setIsBooking(false);
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Try again.");
      setIsBooking(false);
    }
  };

  return (
    <div>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <p>Price: ₹{service.price}</p>
      <input
        type="date"
        value={bookingDate}
        onChange={(e) => setBookingDate(e.target.value)}
        min={new Date().toISOString().split("T")[0]} // Prevent past dates
      />
      <button onClick={handleBookNow} disabled={isBooking}>
        {isBooking ? "Processing..." : "Book Now"}
      </button>
    </div>
  );
};

export default BookService;
