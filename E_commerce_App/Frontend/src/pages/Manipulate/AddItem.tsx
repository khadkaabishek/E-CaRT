import React, { useState,useEffect } from "react";
import "./../../styles/add_item.css";
const AddItem: React.FC = () => {
  const [formData, setFormData] = useState({
    owner_id : "",
    name: "",
    description: "",
    price: "",
    category: "",
    quantityAvailable : "",
  });
  useEffect(() => {
    const userJSON = localStorage.getItem("user");
    if (userJSON) {
      const user = JSON.parse(userJSON);
      console.log("user",user.id);
      setFormData((prev) => ({
        ...prev,
        owner_id: user.id || "",
      }));
    }
  }, []);
  
  const [file, setFile] = useState<File | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("owner", formData.owner_id); 
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("quantityAvailable", formData.quantityAvailable);
      data.append("category", formData.category);
      if (file) data.append("image", file);

      const res = await fetch("http://localhost:5001/api/add_item", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      });
     if(res.status === 401){
       alert("You dont have enough credential for this operation");
      }
      if(res.ok)
      {
        alert("Product added successfully!");
        setFormData({ owner_id:"", name: "", description: "", price: "", category: "",quantityAvailable : "" });
        setFile(null);
      }
    } catch (err) {
      if (err instanceof Error) return (err.message);
      else alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="add-item-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="add-item-form">
        <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Product Name" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
        <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required />
        <input name="quantityAvailable" type="number" value={formData.quantityAvailable} onChange={handleChange} placeholder="Enter number of item to put on stock" required />
        <input name="category" type="text" value={formData.category} onChange={handleChange} placeholder="Category" required />
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddItem;
