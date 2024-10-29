import axios from 'axios';
import { useEffect, useState } from 'react';

const TestComponent = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/test/');
            console.log('Otrzymane dane:', response.data);
            setData(response.data);
            setError(null);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Error fetching data: ", error.response);
            setError('Wystąpił błąd podczas pobierania danych: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#333' }}>Dane z backendu</h2>
            
            {loading && (
                <div style={{ color: '#666', marginBottom: '10px' }}>
                    Ładowanie...
                </div>
            )}

            {error && (
                <div style={{ 
                    backgroundColor: '#ffebee', 
                    padding: '10px', 
                    borderRadius: '5px',
                    marginBottom: '10px',
                    color: '#c62828'
                }}>
                    {error}
                </div>
            )}

            {data && (
                <div>
                    <pre style={{ 
                        backgroundColor: '#f5f5f5', 
                        padding: '15px', 
                        borderRadius: '5px',
                        overflow: 'auto',
                        maxHeight: '400px'
                    }}>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                    
                    {lastUpdated && (
                        <div style={{ 
                            fontSize: '0.8em', 
                            color: '#666',
                            marginTop: '5px' 
                        }}>
                            Ostatnia aktualizacja: {lastUpdated}
                        </div>
                    )}

                    <button 
                        onClick={fetchData}
                        style={{
                            marginTop: '15px',
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={e => e.target.style.backgroundColor = '#0056b3'}
                        onMouseOut={e => e.target.style.backgroundColor = '#007bff'}
                        disabled={loading}
                    >
                        {loading ? 'Odświeżanie...' : 'Odśwież dane'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TestComponent;