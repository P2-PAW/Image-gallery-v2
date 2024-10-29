import React from 'react';
import TestComponent from './TestComponent'; // Upewnij się, że ścieżka jest poprawna

const App = () => {
    return (
        <div>
            <h1>My React App</h1>
            <TestComponent /> {/* Wywołanie komponentu */}
        </div>
    );
};

export default App;