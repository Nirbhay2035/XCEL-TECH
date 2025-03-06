import { useEffect, useState } from "react";
import { getServices, deleteService, addService } from "../api/ServiceApi";
import { Button, Table, Spinner, Form } from "react-bootstrap";

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    fetchServices();
    checkUserRole();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const checkUserRole = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.role) {
      setUserRole(user.role);
    } else {
      setUserRole("user"); // Default to "user" if no role is found
    }

    setLoading(false); // Stop loading after checking role
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id);
        setServices(services.filter(service => service.id !== id));
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.name || !newService.description || !newService.price) {
      alert("All fields are required!");
      return;
    }

    try {
      const addedService = await addService(newService);
      setServices([...services, addedService]);
      setNewService({ name: "", description: "", price: "" }); // Clear form
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="dark" />
        <p>Checking user permissions...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="text-dark">Manage Services</h3>

      {userRole === "admin" ? (
        <>
          {/* Add Service Form */}
          <Form onSubmit={handleAddService} className="mb-4 p-3 border rounded bg-light">
            <h5>Add New Service</h5>
            <Form.Group className="mb-2">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter service name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter service description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              />
            </Form.Group>

            <Button type="submit" variant="success">Add Service</Button>
          </Form>

          {/* Services Table */}
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>${service.price}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(service.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <p className="text-danger">⚠️ You do not have permission to manage services.</p>
      )}
    </div>
  );
};

export default ManageServices;
