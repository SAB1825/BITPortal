import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [inmates, setInmates] = useState([]);
  const [newInmate, setNewInmate] = useState({ name: '', relation: '', phoneNumber: '' });
  const [showInmateForm, setShowInmateForm] = useState(false);
  const [editingInmate, setEditingInmate] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [inmateToDelete, setInmateToDelete] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    fetchInmates();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setFormData(response.data.user);
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to fetch user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInmates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/inmates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInmates(response.data.inmates);
    } catch (error) {
      console.error('Error fetching inmates:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInmateInputChange = (e) => {
    if (editingInmate) {
      setEditingInmate({ ...editingInmate, [e.target.name]: e.target.value });
    } else {
      setNewInmate({ ...newInmate, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setFormData(response.data.user);
        setIsEditing(false);
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleAddInmate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/auth/inmates', newInmate, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInmates([...inmates, response.data.inmate]);
      setNewInmate({ name: '', relation: '', phoneNumber: '' });
      setShowInmateForm(false);
    } catch (error) {
      console.error('Error adding inmate:', error);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/auth/profile-image', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data && response.data.profileImage) {
        setUser(prevUser => ({ ...prevUser, profileImage: response.data.profileImage }));
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      setError('Failed to upload profile image');
    }
  };

  const handleEditInmate = (inmate) => {
    setEditingInmate(inmate);
    setShowInmateForm(true);
  };

  const handleUpdateInmate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/auth/inmates/${editingInmate._id}`, editingInmate, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInmates(inmates.map(inmate => inmate._id === editingInmate._id ? response.data.inmate : inmate));
      setEditingInmate(null);
      setShowInmateForm(false);
    } catch (error) {
      console.error('Error updating inmate:', error);
      if (error.response && error.response.status === 404) {
        alert('Inmate not found. The inmate may have been deleted.');
        // Refresh the inmates list
        fetchInmates();
      } else {
        alert('Failed to update inmate. Please try again.');
      }
    }
  };

  const handleDeleteInmate = (inmate) => {
    setInmateToDelete(inmate);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteInmate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/auth/inmates/${inmateToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh the inmates list after deletion
      fetchInmates();
      setShowDeleteConfirmation(false);
      setInmateToDelete(null);
    } catch (error) {
      console.error('Error deleting inmate:', error);
      if (error.response && error.response.status === 404) {
        alert('Inmate not found. It may have already been deleted.');
      } else {
        alert('Failed to delete inmate. Please try again.');
      }
      // Refresh the inmates list anyway
      fetchInmates();
    }
  };

  if (isLoading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  if (!user || !user.profileCompleted || isEditing) {
    return (
      <div className="bg-black rounded-lg shadow-md p-6 relative border border-white">
        <button
          onClick={() => setIsEditing(false)}
          className="absolute top-4 left-4 bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2 transition duration-300"
        >
          ← Go Back
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <div className="flex items-center space-x-4">
            <img 
              src={user?.profileImage || 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover"
            />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleProfileImageUpload} 
              className="text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          <input
            type="text"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <input
            type="text"
            name="quarterNumber"
            value={formData.quarterNumber || ''}
            onChange={handleInputChange}
            placeholder="quarterNumber"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <input
            type="text"
            name="quarterName"
            value={formData.quarterName || ''}
            onChange={handleInputChange}
            placeholder="Quarter Name"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
            onChange={handleInputChange}
            placeholder="Date of Birth"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <input
            type="text"
            name="aadharNumber"
            value={formData.aadharNumber || ''}
            onChange={handleInputChange}
            placeholder="Aadhar Number"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <input
            type="text"
            name="bloodGroup"
            value={formData.bloodGroup || ''}
            onChange={handleInputChange}
            placeholder="Blood Group"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber || ''}
            onChange={handleInputChange}
            placeholder="Vehicle Number"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <input
            type="text"
            name="department"
            value={formData.department || ''}
            onChange={handleInputChange}
            placeholder="Department"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <textarea
            name="permanentAddress"
            value={formData.permanentAddress || ''}
            onChange={handleInputChange}
            placeholder="Permanent Address"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <input
            type="number"
            name="age"
            value={formData.age || ''}
            onChange={handleInputChange}
            placeholder="Age"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="w-full text-white p-2 border rounded bg-black"
          />
          <button
            type="submit"
            className="bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2 w-full"
          >
            Save Profile
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="bg-[#212121] rounded-[30px] shadow-md p-6 transform hover:scale-105 transition-transform duration-300   md:col-span-1">
          <img 
            src={user.profileImage || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white"
          />
          <h2 className="text-2xl font-bold text-center mb-2">{user.firstName} {user.lastName}</h2>
          <p className="text-center text-gray-400 mb-1">{user.email}</p>
          <p className="text-center text-blue-400 mb-4">{user.department}</p>
          <div className="flex justify-center">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white hover:bg-black text-black hover:text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Contact Details Card */}
        <div className="bg-[#212121] rounded-[30px] shadow-md p-6 transform hover:scale-105 transition-transform duration-300  md:col-span-2">
          <h3 className="text-xl font-semibold mb-4 border-b border-white pb-2">Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-9">
          <InfoItem label="Phone Number" value={user.phoneNumber || 'Not provided'} />
          <InfoItem label="Address" value={user.permanentAddress || 'Not provided'} />
          </div>
          <h3 className="text-xl font-semibold mb-4 border-b border-white pb-2">Quarters Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-9">

          <InfoItem label="Quarters Number" value={user.quarterNumber || 'Not provided'} />
          <InfoItem label="Quarters Name" value={user.quarterName || 'Not provided'} />
          </div>

        </div>

        
        {/* Personal Details Card */}
        <div className="bg-[#212121] rounded-[20px] shadow-md p-6 transform hover:scale-105 transition-transform duration-300  md:col-span-3">
          <h3 className="text-xl font-semibold mb-4 border-b border-white pb-2">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <InfoItem label="Date of Birth" value={new Date(user.dateOfBirth).toLocaleDateString()} />
            <InfoItem label="Age" value={user.age} />
            <InfoItem label="Blood Group" value={user.bloodGroup} />
            <InfoItem label="Aadhar Number" value={user.aadharNumber} />
            <InfoItem label="Vehicle Number" value={user.vehicleNumber} />
            </div>
        </div>

        {/* Inmates Section */}
        <div className="mt-8 bg-[#212121] rounded-lg shadow-md p-6  col-span-full transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold mb-4 border-b border-white ">Inmates</h3>
            <button
              onClick={() => setShowInmateForm(true)}
              className="bg-white hover:bg-black font-bold text-black hover:text-white p-2 rounded "
            >
              Add Inmate
            </button>
          </div>
          
          {inmates.length > 0 ? (
            <div className="overflow-x-auto transform hover:scale-105 transition-transform duration-300">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-">
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Relation</th>
                    <th className="py-2 px-4">Phone Number</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inmates.map((inmate) => (
                    <tr key={inmate._id} className="border-b border-">
                      <td className="py-2 px-4">{inmate.name}</td>
                      <td className="py-2 px-4">{inmate.relation}</td>
                      <td className="py-2 px-4">{inmate.phoneNumber}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleEditInmate(inmate)}
                          className="text-blue-500 hover:text-blue-600 mr-2"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteInmate(inmate)}
                          className="text-red-500 hover:text-red-600"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-400">No inmates added yet.</p>
          )}

          {showInmateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center border border-white">
              <div className="bg-black p-6 rounded-lg w-full max-w-md border border-white">
                <h4 className="text-lg font-semibold mb-4">{editingInmate ? 'Edit Inmate' : 'Add New Inmate'}</h4>
                <form onSubmit={editingInmate ? handleUpdateInmate : handleAddInmate} className="space-y-4 ">
                  <input
                    type="text"
                    name="name"
                    value={editingInmate ? editingInmate.name : newInmate.name}
                    onChange={handleInmateInputChange}
                    placeholder="Name"
                    className="w-full text-white p-2 border rounded bg-black"
                  />
                  <input
                    type="text"
                    name="relation"
                    value={editingInmate ? editingInmate.relation : newInmate.relation}
                    onChange={handleInmateInputChange}
                    placeholder="Relation"
                    className="w-full text-white p-2 border rounded bg-black"
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editingInmate ? editingInmate.phoneNumber : newInmate.phoneNumber}
                    onChange={handleInmateInputChange}
                    placeholder="Phone Number"
                    className="w-full text-white p-2 border rounded bg-black"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowInmateForm(false);
                        setEditingInmate(null);
                      }}
                      className="bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2"
                    >
                      {editingInmate ? 'Update Inmate' : 'Add Inmate'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center border border-white">
          <div className="bg-black p-6 rounded-lg w-full max-w-md border border-white">
            <h4 className="text-lg font-semibold mb-4">Confirm Delete</h4>
            <p className="mb-4">Are you sure you want to delete {inmateToDelete.name}?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteInmate}
                className="bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="mb-2">
    <p className="text-gray-400">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Profile;
