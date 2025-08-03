import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import "./../../styles/edit_item_info.css";
import { useParams } from "react-router-dom";

const EditItemInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const token: string | null = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
  });

  const [images, setImages] = useState<FileList | null>(null);
  const [message, setMessage] = useState("");

  const cartInfo = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/get-item/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch item data");

      const data = await response.json();
      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        quantity: data.quantity || 0,
        category: data.category || "",
      });
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  };

  useEffect(() => {
    cartInfo();
  }, [id]);
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", String(formData.price));
      data.append("quantity", String(formData.quantity));
      data.append("category", formData.category);

      if (images) {
        Array.from(images).forEach((file) => {
          data.append("images", file);
        });
      }

      const response = await fetch(`http://localhost:5001/api/put_item/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      if(response.status === 401){
        const errData = await response.json();
        alert(errData.msg);
      }
      if (!response.ok) throw new Error("Failed to update item");

      const result = await response.json();
      console.log("Update Success:", result);
      setMessage("Item updated successfully ✅");
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("Failed to update item ❌");
    }
  };

  return (
    <form className="edit-item-form" onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} />

      <label htmlFor="description">Description:</label>
      <textarea name="description" value={formData.description} onChange={handleChange} />

      <label htmlFor="price">Price:</label>
      <input type="number" name="price" value={formData.price} onChange={handleChange} />

      <label htmlFor="quantity">Quantity:</label>
      <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />

      <label htmlFor="category">Category:</label>
      <input type="text" name="category" value={formData.category} onChange={handleChange} />

      <label htmlFor="images">Images:</label>
      <input type="file" name="images" multiple onChange={handleImageChange} />

      <button type="submit">Update Item</button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default EditItemInfo;
