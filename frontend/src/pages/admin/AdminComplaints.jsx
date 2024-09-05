import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye } from 'react-icons/fa';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:5000/api/auth/admin/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error.response?.data || error.message);
      setError('Failed to fetch complaint data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/auth/admin/complaints/${complaintId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints(); // Refresh the list after updating
    } catch (error) {
      console.error('Error updating complaint status:', error.response?.data || error.message);
      alert('Failed to update complaint status. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 bg-transparent">
      <h2 className="text-2xl text-white font-bold mb-4">Complaints List</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-white border-collapse">
          <thead>
            <tr className="bg-[#212121]">
              <th className="p-2 text-left border-b border-gray-700">Quarters Number</th>
              <th className="p-2 text-left border-b border-gray-700">Mobile Number</th>
              <th className="p-2 text-left border-b border-gray-700">Complaint</th>
              <th className="p-2 text-left border-b border-gray-700">Image</th>
              <th className="p-2 text-left border-b border-gray-700">Status</th>
              <th className="p-2 text-left border-b border-gray-700">Service Time</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(complaint => (
              <tr key={complaint._id} className="border-b border-gray-700">
                <td className="p-2">{complaint.houseNumber}</td>
                <td className="p-2">{complaint.mobileNumber}</td>
                <td className="p-2">{complaint.description}</td>
                <td className="p-2">
                  {complaint.imageUrl && (
                    <button
                      onClick={() => window.open(complaint.imageUrl, '_blank')}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    >
                      <FaEye />
                    </button>
                  )}
                </td>
                <td className="p-2">
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                    className="bg-gray-700 text-white rounded p-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td className="p-2">
                  {new Date(complaint.serviceTime).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminComplaints;
