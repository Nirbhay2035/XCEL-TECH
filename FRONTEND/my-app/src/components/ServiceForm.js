import { useState, useEffect } from "react";

const ServiceForm = ({ onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(initialData);
    }
  }, [isEditing, initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", description: "", price: "" }); // Reset form after submission
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label className="form-label">Service Name</label>
        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Price ($)</label>
        <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
      </div>
      <button type="submit" className={`btn ${isEditing ? "btn-warning" : "btn-success"} w-100`}>
        {isEditing ? "Update Service" : "Add Service"}
      </button>
    </form>
  );
};

export default ServiceForm;
