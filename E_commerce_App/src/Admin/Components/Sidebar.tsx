import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/App.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">Admin Panel</h2>
      <ul>
        <li><NavLink to="/admin/users">Users</NavLink></li>
        <li><NavLink to="/admin/sellers">Sellers</NavLink></li>
        <li><NavLink to="/admin/requests">Requests</NavLink></li>
      </ul>
    </div>
  );
};

export default Sidebar;
