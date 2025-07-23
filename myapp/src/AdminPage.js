import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // <-- For navigation after logout
import './AdminPage.css';

const AdminPage = () => {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: '', type: '', location: '', price: '', rating: '',
    image: '', maxPerson: '', description: '', discount: '', size: ''
  });
  const [editingRoomId, setEditingRoomId] = useState(null);

  const navigate = useNavigate();  // <-- Initialize navigate

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoomId) {
        await axios.put(`http://localhost:5000/api/rooms/${editingRoomId}`, formData);
        setEditingRoomId(null);
      } else {
        await axios.post('http://localhost:5000/api/rooms', formData);
      }
      setFormData({
        name: '', type: '', location: '', price: '', rating: '',
        image: '', maxPerson: '', description: '', discount: '', size: ''
      });
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const handleEdit = (room) => {
    setFormData(room);
    setEditingRoomId(room._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`);
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  // Logout function
  const handleLogout = () => {
    // Clear any stored auth info
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="admin-container">
      {/* Logout button top right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <h2 className="admin-title">{editingRoomId ? 'Edit Room' : 'Add Room'}</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Room Name" required />
        <input name="type" value={formData.type} onChange={handleChange} placeholder="Type" required />
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
        <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required />
        <input name="rating" type="number" value={formData.rating} onChange={handleChange} placeholder="Rating" min="1" max="5" step="0.1" required />
        <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required />
        <input name="maxPerson" type="number" value={formData.maxPerson} onChange={handleChange} placeholder="Max Persons" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
        <input name="discount" type="number" value={formData.discount} onChange={handleChange} placeholder="Discount (%)" />
        <input name="size" value={formData.size} onChange={handleChange} placeholder="Room Size (e.g., 300 sqft)" />
        <button type="submit" className="submit-btn">
          {editingRoomId ? 'Update Room' : 'Add Room'}
        </button>
      </form>

      <h2 className="admin-title">Room List</h2>
      <div className="room-list">
        {rooms.map((room) => (
          <div key={room._id} className="room-card">
            <img src={room.image} alt={room.name} className="room-image" />
            <div className="room-details">
              <h3>{room.name}</h3>
              <p><strong>Location:</strong> {room.location}</p>
              <p><strong>Price:</strong> ₹{room.price}</p>
              <p><strong>Type:</strong> {room.type}</p>
              <p><strong>Rating:</strong> {room.rating}</p>
              <p><strong>Max Persons:</strong> {room.maxPerson}</p>
              <p><strong>Description:</strong> {room.description}</p>
              <p><strong>Discount:</strong> {room.discount}%</p>
              <p><strong>Size:</strong> {room.size}</p>
              <div className="room-actions">
                <button onClick={() => handleEdit(room)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(room._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
