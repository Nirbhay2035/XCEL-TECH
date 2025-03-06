import { useState } from "react";
import { initiatePayment } from "../api/ServiceApi";

const BookService = ({ service }) => {
  const [bookingDate, setBookingDate] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const handleBookNow = async () => {
    if (!bookingDate) {
      alert("Please select a booking date.");
      return;
    }

    setIsBooking(true);

    try {
      const paymentData = await initiatePayment(service.id, service.price);

      // Open Razorpay Payment Modal
      const options = {
        key: paymentData.razorpay_key,
        amount: paymentData.amount,
        currency: "INR",
        name: "Service Payment",
        description: service.name,
        order_id: paymentData.order_id,
        handler: async (response) => {
          alert("Payment Successful!");
          console.log("Payment Success:", response);
          setIsBooking(false);
        },
        prefill: {
          email: "user@example.com",
          contact: "9999999999",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Error:", error);
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
