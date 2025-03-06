import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Globe, Wifi, Phone, Settings, Users, BarChart } from "lucide-react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import axios from "axios";

export default function LandingPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);


    const handleSubscribe = async () => {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setMessage("Please enter a valid email.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/newsletter/subscribe/", { email });
            setMessage(response.data.message);
            setEmail(""); // Clear input on success
        } catch (error) {
            setMessage("Subscription failed. Try again.");
        }
        setLoading(false);
    };


    // ✅ If Admin Logged in, Show Admin Dashboard
    if (user && user.role === "admin") {
        return (
            <div className="min-vh-100 bg-dark text-light">
                {/* Admin Dashboard Section */}
                <section className="text-center py-5 bg-primary">
                    <h1 className="display-4 font-weight-bold">Admin Dashboard</h1>
                    <p className="lead">Manage Users, Services, and Bookings</p>
                </section>

                <Container className="mt-4">
                    <section className="py-5">
                        <div className="row row-cols-1 row-cols-md-3 g-4">
                            {[
                                { icon: <Users />, title: "Manage Users", desc: "Add, remove, and manage users.", path: "/manage-users" },
                                { icon: <Settings />, title: "Manage Services", desc: "Control available services.", path: "/manage-services" },
                                { icon: <BarChart />, title: "View Reports", desc: "Analyze business statistics.", path: "/reports" },
                            ].map((item, index) => (
                                <motion.div key={index} whileHover={{ scale: 1.05 }} className="col">
                                    <Link to={item.path} style={{ textDecoration: "none" }}>
                                        <Card className="bg-dark text-light h-100">
                                            <Card.Body className="text-center">
                                                <div className="text-warning mb-3">{item.icon}</div>
                                                <Card.Title className="h4">{item.title}</Card.Title>
                                                <Card.Text>{item.desc}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </Container>
            </div>
        );
    }

    // ✅ If User or Guest, Show Regular Landing Page
    return (
        <div className="min-vh-100 bg-dark text-light">
            {/* Hero Section */}
            <section className="text-center py-5 px-4 bg-gradient-to-r from-blue-700 to-purple-800">
                <h1 className="display-4 font-weight-bold mb-4">Connecting You to the Future</h1>
                <p className="lead mb-6">High-speed, reliable networking and telecom services</p>
                <Link to="/login">
                    <Button size="lg" className="bg-primary text-white">Get Started</Button>
                </Link>
            </section>

            <Container className="mt-1">
                {/* Services Section */}
                <section className="py-5">
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {[
                            { icon: <Globe />, title: "Internet Services", desc: "Fast and reliable broadband.", path: "/services" },
                            { icon: <Wifi />, title: "Fiber Optics", desc: "Experience ultra-fast speeds.", path: "/services" },
                            { icon: <Phone />, title: "VoIP Solutions", desc: "Crystal clear communication.", path: "/voip-solutions" },
                        ].map((service, index) => (
                            <motion.div key={index} whileHover={{ scale: 1.05 }} className="col">
                                <Link to={service.path} style={{ textDecoration: "none" }}>
                                    <Card className="bg-dark text-light h-100">
                                        <Card.Body className="text-center">
                                            <div className="text-primary mb-3">{service.icon}</div>
                                            <Card.Title className="h4">{service.title}</Card.Title>
                                            <Card.Text>{service.desc}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </Container>

            {/* Newsletter Section */}
            <section className="py-3 bg-dark text-center">
                <h2 className="h3 font-weight-bold mb-4">Stay Updated</h2>

                <div className="d-flex justify-content-center gap-2">
                    <input
                        type="email"
                        className="form-control form-control-lg w-50"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button onClick={handleSubscribe} variant="primary" size="lg" disabled={loading}>
                        {loading ? "Subscribing..." : "Subscribe"}
                    </Button>

                </div>
                <p className="mt-3 text-success">
                    {message ? message : "Subscribe to our newsletter to stay updated!"}
                </p>
            </section>
        </div>
    );
}
