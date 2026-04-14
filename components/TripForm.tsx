import React, { useState } from 'react';

const TripForm = () => {
    const [destination, setDestination] = useState('');
    const [origin, setOrigin] = useState('');
    const [budget, setBudget] = useState('');
    const [travelers, setTravelers] = useState('');
    const [duration, setDuration] = useState('');
    const [travelStyle, setTravelStyle] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({ destination, origin, budget, travelers, duration, travelStyle, specialRequests });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Destination:</label>
                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} required />
            </div>
            <div>
                <label>Origin:</label>
                <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
            </div>
            <div>
                <label>Budget:</label>
                <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} required />
            </div>
            <div>
                <label>Travelers:</label>
                <input type="number" value={travelers} onChange={(e) => setTravelers(e.target.value)} required />
            </div>
            <div>
                <label>Duration:</label>
                <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            </div>
            <div>
                <label>Travel Style:</label>
                <input type="text" value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)} required />
            </div>
            <div>
                <label>Special Requests:</label>
                <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TripForm;