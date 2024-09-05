import  { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  const DetailRow = ({ label, value }) => (
    <>
      <div className="grid grid-cols-2 gap-2 text-left py-2">
        <p className="text-sm text-gray-400">{label}:</p>
        <p className="text-sm text-white">{value || 'N/A'}</p>
      </div>
      <hr className="border-gray-600" />
    </>
  );

  DetailRow.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-[32rem] shadow-lg rounded-md bg-black text-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-white mb-2">{user.username}'s Details</h3>
          <div className="mt-2 px-7 py-3">
            {user.profileImage && (
              <img src={user.profileImage} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4"/>
            )}
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Quarter Number" value={user.quarterNumber} />
            <DetailRow label="Quarter Name" value={user.quarterName} />
            <DetailRow label="Role" value={user.role} />
            <DetailRow label="Name" value={`${user.firstName || ''} ${user.lastName || ''}`} />
            <DetailRow label="Blood Group" value={user.bloodGroup} />
            <DetailRow label="Aadhar Number" value={user.aadharNumber} />
            <DetailRow label="Vehicle Number" value={user.vehicleNumber} />
            <DetailRow label="Date of Birth" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'} />
            <DetailRow label="Department" value={user.department} />
            <DetailRow label="Age" value={user.age} />
            <DetailRow label="Phone Number" value={user.phoneNumber} />
            <DetailRow label="Permanent Address" value={user.permanentAddress} />
          </div>
        </div>
        <div className="items-center px-4 py-3">
          <button
            id="ok-btn"
            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

UserDetailsModal.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
    quarterNumber: PropTypes.string,
    quarterName: PropTypes.string,
    role: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    bloodGroup: PropTypes.string,
    aadharNumber: PropTypes.string,
    vehicleNumber: PropTypes.string,
    dateOfBirth: PropTypes.string,
    department: PropTypes.string,
    permanentAddress: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    phoneNumber: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-black p-4 rounded-md shadow-lg border border-gray-600 w-80">
        <h3 className="text-lg font-medium text-white mb-4">Confirm Deletion</h3>
        <p className="text-white mb-4">Are you sure you want to delete the user "{userName}"?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

const Staffs = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, userId: null, userName: '' });

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStaffs(response.data);
    } catch (error) {
      console.error('Error fetching staffs:', error.response?.data || error.message);
      setError('Failed to fetch staff data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStaffs(); // Refresh the list after deletion
      setDeleteConfirmation({ isOpen: false, userId: null, userName: '' });
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const userStaffs = staffs.filter(staff => staff.role !== 'admin');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 bg-transparent">
      <h2 className="text-2xl text-white font-bold mb-4">User List</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-white border-collapse">
          <thead>
            <tr className="bg-[#212121]">
              <th className="p-2 text-left border-b border-gray-700">Name</th>
              <th className="p-2 text-left border-b border-gray-700">Email</th>
              <th className="p-2 text-left border-b border-gray-700">Quarters No</th>
              <th className="p-2 text-left border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userStaffs.map(staff => (
              <tr key={staff._id} className="border-b border-gray-700">
                <td className="p-2">{staff.username}</td>
                <td className="p-2">{staff.email}</td>
                <td className="p-2">{staff.quarterNumber || 'N/A'}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleViewDetails(staff)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmation({ isOpen: true, userId: staff._id, userName: staff.username })}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, userId: null, userName: '' })}
        onConfirm={() => handleDelete(deleteConfirmation.userId)}
        userName={deleteConfirmation.userName}
      />
    </div>
  );
};

export default Staffs;
