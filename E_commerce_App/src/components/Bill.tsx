
import React from "react";
import "./../styles/bill.css"
interface OwnerType {
  name: string;
  email: string;
}

interface ProductType {
  _id: string;
  name: string;
  price: number;
  owner?: OwnerType;
}

interface OrderItem {
  product: ProductType;
  quantity: number;
}

interface BillProps {
  orderId: string;
  contact: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  status: string;
  items: OrderItem[];
  createdAt: string;
  shippingFee?: number;
  taxPercent?: number;
}

const Bill: React.FC<BillProps> = ({
  orderId,
  contact,
  status,
  items,
  createdAt,
  shippingFee = 100,
  taxPercent = 0,
}) => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const taxAmount = (subtotal * taxPercent) / 100;
  const total = subtotal + taxAmount + shippingFee;

  return (
    <div className="bill-container">
      <h2>Order Bill</h2>
      <div className="bill-header">
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Order Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
      </div>

      <div className="bill-contact">
        <h3>Shipping Information</h3>
        <p>{contact.name}</p>
        <p>{contact.phone}</p>
        <p>{contact.address}, {contact.city}</p>
      </div>
      <div className="bill-payment">
        <h3>Payment Method</h3>
        <p>Cash on Delivery</p>
      </div>
      <table className="bill-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Seller</th>
            <th>Qty</th>
            <th>Price (Rs.)</th>
            <th>Subtotal (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.product._id}>
              <td>{item.product.name}</td>
              <td>{item.product.owner?.name || "Unknown"}</td>
              <td>{item.quantity}</td>
              <td>{item.product.price.toLocaleString()}</td>
              <td>{(item.product.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bill-summary">
        <p><strong>Subtotal:</strong> Rs. {subtotal.toLocaleString()}</p>
        {taxPercent > 0 && (
          <p><strong>Tax ({taxPercent}%):</strong> Rs. {taxAmount.toLocaleString()}</p>
        )}
        <p><strong>Shipping Fee:</strong> Rs. {shippingFee.toLocaleString()}</p>
        <h3><strong>Total:</strong> Rs. {total.toLocaleString()}</h3>
      </div>
    </div>
  );
};

export default Bill;
