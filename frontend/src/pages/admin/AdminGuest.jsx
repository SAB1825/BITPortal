import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminGuests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:5000/api/auth/admin/guests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setGuests(response.data.guests);
    } catch (error) {
      console.error('Error fetching guests:', error.response?.data || error.message);
      setError('Failed to fetch guest data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInOut = async (guestId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/auth/admin/guests/${guestId}/${action}`, 
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGuests(); // Refresh the list after updating
    } catch (error) {
      console.error(`Error updating guest ${action}:`, error.response?.data || error.message);
      alert(`Failed to update guest ${action}. Please try again.`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 bg-transparent">
      <h2 className="text-2xl text-white font-bold mb-4">Guest List</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-white border-collapse">
          <thead>
            <tr className="bg-[#212121]">
              <th className="p-2 text-left border-b border-gray-700">Quarters Number</th>
              <th className="p-2 text-left border-b border-gray-700">Guest Name</th>
              <th className="p-2 text-left border-b border-gray-700">Phone Number</th>
              <th className="p-2 text-left border-b border-gray-700">Check-In Time</th>
              <th className="p-2 text-left border-b border-gray-700">Check-Out Time</th>
              <th className="p-2 text-left border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map(guest => (
              <tr key={guest._id} className="border-b border-gray-700">
                <td className="p-2">{guest.user.quarterNumber}</td>
                <td className="p-2">{guest.guestName}</td>
                <td className="p-2">{guest.phoneNumber}</td>
                <td className="p-2">{guest.actualCheckInTime ? new Date(guest.actualCheckInTime).toLocaleString() : 'Not checked in'}</td>
                <td className="p-2">{guest.actualCheckOutTime ? new Date(guest.actualCheckOutTime).toLocaleString() : 'Not checked out'}</td>
                <td className="p-2">
                  {!guest.actualCheckInTime && (
                    <button
                      onClick={() => handleCheckInOut(guest._id, 'checkin')}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      <FaCheckCircle /> Check In
                    </button>
                  )}
                  {guest.actualCheckInTime && !guest.actualCheckOutTime && (
                    <button
                      onClick={() => handleCheckInOut(guest._id, 'checkout')}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      <FaTimesCircle /> Check Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGuests;
