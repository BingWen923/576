import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Staff from './components/staff.js'; // Import the merged Staff component

function App() {
    return (
        <div className="App">
            <Staff /> {/* Render the merged Staff component */}
        </div>
    );
}

export default App;
