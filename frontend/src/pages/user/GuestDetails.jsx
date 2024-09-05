import  { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const GuestDetails = () => {
    const [guestName, setGuestName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date());
    const [verificationCode, setVerificationCode] = useState('');
    const [guestId, setGuestId] = useState(null);
    const [guests, setGuests] = useState([]);
    const [showVerification, setShowVerification] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [guestToDelete, setGuestToDelete] = useState(null);
    const [numberOfGuest, setNumberOfGuest] = useState(null);

    useEffect(() => {
        fetchGuests();
    }, []);

    const fetchGuests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/auth/guests', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGuests(response.data);
        } catch (error) {
            console.error('Error fetching guests:', error.response?.data || error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/auth/guests', {
                guestName,
                phoneNumber,
                numberOfGuest,
                checkInDate,
                checkOutDate,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGuestId(response.data.guestId);
            setShowVerification(true);
            setShowForm(false);
        } catch (error) {
            console.error('Error adding guest:', error);
            alert('Failed to add guest');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/auth/guests/verify', {
                guestId,
                verificationCode,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowVerification(false);
            fetchGuests();
            alert('Guest verified successfully');
        } catch (error) {
            console.error('Error verifying guest:', error.response?.data || error.message);
            alert('Failed to verify guest');
        }
    };

    const handleDelete = async (guestId) => {
        setGuestToDelete(guestId);
        setIsDeleting(true);
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/auth/guests/${guestToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchGuests();
            setIsDeleting(false);
            alert('Guest deleted successfully');
        } catch (error) {
            console.error('Error deleting guest:', error.response?.data || error.message);
            alert('Failed to delete guest');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 bg-transparent">
            <h2 className="text-2xl text-white font-bold mb-4">Guest Details</h2>
            <button
                onClick={() => setShowForm(true)}
                className="bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2 mb-4"
            >
                Add Guest
            </button>
            <div className="overflow-x-auto">
                <table className="w-full text-white border-collapse">
                    <thead>
                        <tr className="bg-[#212121]">
                            <th className="p-2 text-left border-b border-gray-700">Guest Name</th>
                            <th className="p-2 text-left border-b border-gray-700">Phone Number</th>
                            <th className="p-2 text-left border-b border-gray-700">No. of Guest</th>
                            <th className="p-2 text-left border-b border-gray-700">Check-in Date</th>
                            <th className="p-2 text-left border-b border-gray-700">Check-out Date</th>
                            <th className="p-2 text-left border-b border-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.map((guest) => (
                            <tr key={guest._id} className="border-b border-gray-700">
                                <td className="p-2">{guest.guestName}</td>
                                <td className="p-2">{guest.phoneNumber}</td>
                                <td className="p-2">{guest.numberOfGuest}</td>
                                <td className="p-2">{new Date(guest.checkInDate).toLocaleDateString()}</td>
                                <td className="p-2">{new Date(guest.checkOutDate).toLocaleDateString()}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleDelete(guest._id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-black border border-white p-4 rounded-lg max-w-md w-full">
                        <h2 className="text-2xl text-white font-bold mb-4">Add Guest</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="guestName" className="block mb-1 text-white">Guest Name</label>
                                <input
                                    type="text"
                                    id="guestName"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    required
                                    className="w-full bg-black text-white p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block mb-1 text-white">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                    className="w-full bg-black text-white p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block mb-1 text-white">Number of Guest</label>
                                <input
                                    type="text"
                                    id="numberOfGuest"
                                    value={numberOfGuest}
                                    onChange={(e) => setNumberOfGuest(e.target.value)}
                                    required
                                    className="w-full bg-black text-white p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="checkInDate" className="block text-white mb-1">Check-in Date</label>
                                <DatePicker
                                    selected={checkInDate}
                                    onChange={(date) => setCheckInDate(date)}
                                    dateFormat="MMMM d, yyyy"
                                    className="w-full p-2 bg-black text-white border rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="checkOutDate" className="block text-white mb-1">Check-out Date</label>
                                <DatePicker
                                    selected={checkOutDate}
                                    onChange={(date) => setCheckOutDate(date)}
                                    dateFormat="MMMM d, yyyy"
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
                                    Add Guest
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showVerification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-black border border-white p-4 rounded-lg max-w-md w-full">
                        <h2 className="text-2xl text-white font-bold mb-4">Verify Guest</h2>
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div>
                                <label htmlFor="verificationCode" className="block mb-1 text-white">Verification Code</label>
                                <input
                                    type="text"
                                    id="verificationCode"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    required
                                    className="w-full bg-black text-white p-2 border rounded"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowVerification(false)}
                                    className="bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2"
                                >
                                    Verify Guest
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-black border border-white p-4 rounded-lg max-w-md w-full">
                        <h2 className="text-2xl text-white font-bold mb-4">Confirm Delete</h2>
                        <p className="text-white mb-4">Are you sure you want to delete this guest?</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsDeleting(false)}
                                className="bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded-lg"
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

export default GuestDetails;