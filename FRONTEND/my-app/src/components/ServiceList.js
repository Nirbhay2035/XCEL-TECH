import { useEffect, useState } from "react";
import { getServices, deleteService } from "../api/ServiceApi";
import { Button, Table } from "react-bootstrap";

const ServiceList = ({ onEdit }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id);
        setServices(services.filter(service => service.id !== id)); // Update UI
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-white">Service List</h3>
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
                <Button variant="warning" size="sm" onClick={() => onEdit(service)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(service.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ServiceList;
