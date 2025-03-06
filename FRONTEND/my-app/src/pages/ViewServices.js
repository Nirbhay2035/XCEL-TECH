import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button,  Row, Col, Modal, Form, Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import { Link } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

const ViewServices = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bandwidths, setBandwidths] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBandwidth, setSelectedBandwidth] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    user: 1, // TODO: Replace with actual logged-in user ID
    service: null,
    booking_date: "",
  });
  const [bookingId, setBookingId] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [selectedCategory, selectedBandwidth, selectedPriceRange]);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}services/`);
      setServices(response.data);
      setFilteredServices(response.data); // Initially show all services
      // Populate categories and bandwidths from the service data
      const uniqueCategories = [...new Set(response.data.map((service) => service.category))];
      const uniqueBandwidths = [...new Set(response.data.map((service) => service.bandwidth))];
      setCategories(uniqueCategories);
      setBandwidths(uniqueBandwidths);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    // Filter by Category
    if (selectedCategory) {
      filtered = filtered.filter((service) => service.category === selectedCategory);
    }

    // Filter by Bandwidth
    if (selectedBandwidth) {
      filtered = filtered.filter((service) => service.bandwidth === selectedBandwidth);
    }

    // Filter by Price Range
    if (selectedPriceRange) {
      const [minPrice, maxPrice] = selectedPriceRange.split("-").map(Number);
      filtered = filtered.filter(
        (service) => service.price >= minPrice && service.price < maxPrice
      );
    }

    setFilteredServices(filtered);
  };
  const navigate = useNavigate();

  const handleBookNow = (service) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("You must be logged in to book a service!");
      navigate("/login");
      return;
    }
    setSelectedService(service);
    setShow(true);
  };
  
  const fetchRazorpayKey = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}payments/razorpay-key/`);
      return response.data.key;
    } catch (error) {
      console.error("Error fetching Razorpay key:", error);
      return null;
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingData.booking_date).setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Please select a future date for booking.");
      return;
    }

    if (!selectedService) {
      alert("Service selection error. Please try again.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}bookings/book/`, bookingData);
      const newBookingId = response.data.id;
      setBookingId(newBookingId);
      setShow(false);
      await initiatePayment(newBookingId, selectedService.price);
    } catch (error) {
      console.error("Error booking service:", error);
      alert("Booking failed. Please try again.");
    }
  };

  const initiatePayment = async (bookingId, amount) => {
    try {
      const razorpayKey = await fetchRazorpayKey();
      if (!razorpayKey) {
        alert("Error fetching payment details");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}payments/create-order/${bookingId}/`);
      const { order_id } = response.data;

      const options = {
        key: razorpayKey,
        amount: amount * 100, // Convert to paisa
        currency: "INR",
        name: "Xcel Tech Services",
        description: selectedService?.name || "Service Payment",
        order_id,
        handler: async function (paymentResponse) {
          try {
            await axios.post(`${API_BASE_URL}payments/verify-payment/`, {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });
            setPaymentSuccess(true);
            alert("Payment Successful!");
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment failed. Please try again.");
          }
        },
        theme: { color: "#3399cc" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  const downloadInvoice = () => {
    if (!bookingId) {
      alert("No valid booking found!");
      return;
    }
    window.open(`${API_BASE_URL}payments/invoice/${bookingId}/`, "_blank");
  };

  return (
    <div className="p-3 bg-dark text-light">
      <h2 className="text-center text-white mb-4">Our Services</h2>

      {/* Filters Section */}
      <div className="mb-4">
        <Row>
          <Col md={4}>
            <DropdownButton
              variant="secondary"
              title={selectedCategory || "Select Category"}
              onSelect={(category) => setSelectedCategory(category)}
            >
              <Dropdown.Item key="all-categories" style={{ cursor: "pointer" }} eventKey={null}>All</Dropdown.Item>
              {categories.map((category) => (
                <Dropdown.Item
                  key={`category-${category}`} // Prefix the key with a category to ensure uniqueness
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    transition: "background-color 0.3s",
                  }}
                  eventKey={category}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#007bff"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  {category}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>

          <Col md={4}>
            <DropdownButton
              variant="secondary"
              title={selectedBandwidth || "Select Bandwidth"}
              onSelect={(bandwidth) => setSelectedBandwidth(bandwidth)}
            >
              <Dropdown.Item key="all-bandwidths" style={{ cursor: "pointer" }} eventKey={null}>All</Dropdown.Item>
              {bandwidths.map((bandwidth) => (
                <Dropdown.Item
                  key={`bandwidth-${bandwidth}`} // Prefix the key with bandwidth to ensure uniqueness
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    transition: "background-color 0.3s",
                  }}
                  eventKey={bandwidth}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#007bff"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  {bandwidth}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>

          <Col md={4}>
            <DropdownButton
              variant="secondary"
              title={selectedPriceRange || "Select Price Range"}
              onSelect={(range) => setSelectedPriceRange(range)}
            >
              <Dropdown.Item key="all-price-ranges" style={{ cursor: "pointer" }} eventKey={null}>All</Dropdown.Item>
              {["0-500", "500-1000", "1000-1500", "1500-2000", "2000-3000", "3000-5000", "5000-10000"].map((range) => (
                <Dropdown.Item
                  key={`price-range-${range}`} // Prefix the key with price range to ensure uniqueness
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    transition: "background-color 0.3s",
                  }}
                  eventKey={range}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#007bff"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  ₹{range.replace("-", " - ₹")}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
        </Row>
      </div>


{/* Services List */}
<Row>
  {filteredServices.map((service) => (
    <Col key={service.id || service.name} md={4} className="mb-4">
      <Card className="text-center bg-dark text-white shadow-lg rounded-3">
        {/* Service Image (If available) */}
        {service.image && (
          <Card.Img variant="top" src={service.image} className="rounded-top" alt={service.name} />
        )}

        <Card.Body>
          {/* Service Name */}
          <Card.Title className="border-bottom pb-2">{service.name}</Card.Title>

          {/* Service Details */}
          <Card.Text className="text-light">{service.description}</Card.Text>
          <Card.Text><strong>Speed:</strong> {service.bandwidth} Mbps</Card.Text>
          <Card.Text><strong>Price:</strong> ₹{service.price} + GST</Card.Text>
          <Card.Text><strong>Duration:</strong> {service.duration} days</Card.Text>

         

         

          {/* Book Now Button */}
          <div className="mt-3">
            <Button variant="primary" onClick={() => handleBookNow(service)}>Book Now</Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>





      {/* Booking Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book {selectedService?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleBookingSubmit}>
            <Form.Group>
              <Form.Label>Booking Date</Form.Label>
              <Form.Control
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={bookingData.booking_date}
                onChange={(e) => setBookingData({ ...bookingData, booking_date: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit" className="mt-3">
              Confirm Booking
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {paymentSuccess && (
        <div className="text-center mt-4">
          <Button variant="success" onClick={downloadInvoice}>
            Download Invoice
          </Button>
        </div>
      )}
    </div>
  );
};

export default ViewServices;
