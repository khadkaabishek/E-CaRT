import React, { useEffect, useState } from "react";
import "./../styles/Users.css";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  image?: string;
  isVerified?: boolean;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:5001/admin/viewUsers")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="users-container">
      <h1>User Information</h1>
      <div className="card-wrapper">
        {users.map((user) => (
          <div className="user-card" key={user._id}>
          {user.image && (
            <img src={user.image} alt={`${user.name}'s avatar`} className="user-image" />
          )}
          <h2>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          <p>
            <strong>Verified:</strong>{" "}
            <span className={user.isVerified ? "verified" : "not-verified"}>
              {user.isVerified ? "Yes ✅" : "No ❌"}
            </span>
          </p>
        </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
