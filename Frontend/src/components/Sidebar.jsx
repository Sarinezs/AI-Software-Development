import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
        <h2>Sidebar Menu</h2>
        <ul>
          <li><a href="#">🏠 Home</a></li>
          <li><a href="#">👤 Profile</a></li>
          <li><a href="#">⚙️ Settings</a></li>
        </ul>
      </div>

      {/* Menu Button */}
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>

      {/* CSS */}
      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: -250px;
          width: 250px;
          height: 100%;
          background: #333;
          color: white;
          padding: 20px;
          transition: left 0.3s;
        }
        .sidebar.open {
          left: 0;
        }
        .sidebar h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        .sidebar ul {
          list-style: none;
          padding: 0;
        }
        .sidebar li {
          margin: 15px 0;
        }
        .sidebar a {
          color: white;
          text-decoration: none;
          display: block;
          padding: 10px;
          border-radius: 5px;
          transition: background 0.3s;
        }
        .sidebar a:hover {
          background: #555;
        }
        .menu-btn {
          position: fixed;
          top: 15px;
          left: 15px;
          font-size: 24px;
          background: #333;
          color: white;
          border: none;
          padding: 10px;
          cursor: pointer;
          border-radius: 5px;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 20px;
          background: none;
          color: white;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
