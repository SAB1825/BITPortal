import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [houseNumber, setHouseNumber] = useState('');
  const [description, setDescription] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [serviceTime, setServiceTime] = useState(new Date());
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/complaints', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('houseNumber', houseNumber);
    formData.append('description', description);
    formData.append('serviceTime', serviceTime.toISOString());
    formData.append('mobileNumber', mobileNumber);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:5000/api/auth/complaints', formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Complaint submitted successfully');
      setHouseNumber('');
      setDescription('');
      setServiceTime(new Date());
      setMobileNumber('');
      setImage(null);
      setShowForm(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-500';
      case 'Approved':
        return 'bg-orange-500';
      case 'Resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-black ">
      <h2 className="text-2xl text-white font-bold mb-4">Your Complaints</h2>
      <button
        onClick={() => setShowForm(true)}
        className="bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2 mb-4"
      >
        Add Complaint
      </button>
      <div className="overflow-x-auto  ">
        <table className="w-full text-white border-collapse">
          <thead>
            <tr className="bg-[#212121]">
              <th className="p-2 text-left border-b border-gray-700">House Number</th>
              <th className="p-2 text-left border-b border-gray-700">Description</th>
              <th className="p-2 text-left border-b border-gray-700">Service Time</th>
              <th className="p-2 text-left border-b border-gray-700">Mobile Number</th>
              <th className="p-2 text-left border-b border-gray-700">Status</th>
              <th className="p-2 text-left border-b border-gray-700">Image</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id} className="border-b border-gray-700">
                <td className="p-2">{complaint.houseNumber}</td>
                <td className="p-2">{complaint.description}</td>
                <td className="p-2">{new Date(complaint.serviceTime).toLocaleString()}</td>
                <td className="p-2">{complaint.mobileNumber}</td>

                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </td>

                <td className="p-2">
                  {complaint.imageUrl && (
                    <a href={complaint.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View Image
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-black border border-white p-4 rounded-lg max-w-md w-full">
            <h2 className="text-2xl text-white font-bold mb-4">Submit a Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="houseNumber" className="block mb-1 text-white">House Number</label>
                <input
                  type="text"
                  id="houseNumber"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  required
                  className="w-full bg-black text-white p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="description" className="text-white block mb-1">Description of Complaint</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-black text-white p-2 border rounded"
                  rows="4"
                ></textarea>
              </div>
              <div>
                <label htmlFor="mobileNumber" className="text-white block mb-1">Mobile Number</label>
                <input
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  className="w-full bg-black text-white p-2 border rounded"
                  rows="4"
                ></input>
              </div>
              <div>
                <label htmlFor="serviceTime" className="block text-white mb-1">Time to Do the Service</label>
                <DatePicker
                  selected={serviceTime}
                  onChange={(date) => setServiceTime(date)}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full p-2 bg-black text-white border rounded"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-white mb-1">Image (optional)</label>
                <input
                  type="file"
                  id="image"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  className="w-full p-2 bg-black text-white border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
