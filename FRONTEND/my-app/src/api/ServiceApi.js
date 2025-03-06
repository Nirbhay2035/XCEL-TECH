import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";
const SERVICES_URL = `${API_BASE_URL}services/`;
const PAYMENTS_URL = `${API_BASE_URL}payments/`;

// Fetch all services
export const getServices = async () => {
  try {
    const response = await axios.get(SERVICES_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

// Add a new service (Admin only)
export const addService = async (serviceData) => {
  try {
    const response = await axios.post(SERVICES_URL, serviceData);
    return response.data;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error;
  }
};

// Update a service (Admin only)
export const updateService = async (id, serviceData) => {
  try {
    const response = await axios.put(`${SERVICES_URL}${id}/`, serviceData);
    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

// Delete a service (Admin only)
export const deleteService = async (id) => {
  try {
    await axios.delete(`${SERVICES_URL}${id}/`);
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};

// Fetch Razorpay public key (needed for frontend)
export const getRazorpayKey = async () => {
  try {
    const response = await axios.get(`${PAYMENTS_URL}razorpay-key/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Razorpay key:", error);
    throw error;
  }
};

// Start Razorpay Payment (booking_id is required, not service_id)
export const initiatePayment = async (bookingId) => {
  try {
    const response = await axios.post(`${PAYMENTS_URL}create-order/${bookingId}/`);
    return response.data;
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
};

// Verify Payment Status
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${PAYMENTS_URL}verify-payment/`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

// Generate Invoice (PDF) after successful payment
export const generateInvoice = async (bookingId) => {
  try {
    const response = await axios.get(`${PAYMENTS_URL}invoice/${bookingId}/`, {
      responseType: "blob", // Required to download PDF
    });

    // Create a downloadable link
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_${bookingId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating invoice:", error);
    throw error;
  }
};
export const subscribeNewsletter = async (email) => {
  try {
      console.log("Sending email to:", email);  // Debugging log
      const response = await axios.post(`${API_BASE_URL}newsletter/subscribe/`, { email });
      console.log("Response:", response.data);
      return response.data;
  } catch (error) {
      console.error("Subscription Error:", error.response ? error.response.data : error.message);
      throw error;
  }
};
