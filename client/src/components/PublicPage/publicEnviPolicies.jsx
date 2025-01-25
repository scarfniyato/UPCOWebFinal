import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PublicEnviPolicies = () => {
    const [files, setFiles] = useState([]);

    // Fetch files from the backend
    const fetchFiles = async () => {
        try {
            const response = await axios.get('/api/files'); // Backend endpoint to fetch files
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files:', error.message);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div className="public-policies-container" style={{ width: '100%', margin: '0 auto', padding: '20px' }}>
            <div
                className="card-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)', // 4 fixed columns
                    gap: '25px', // Spacing between cards
                    justifyContent: 'center',
                }}
            >
                {files.length > 0 ? (
                    files.map((file) => {
                        // Generate embeddable preview link
                        const embedLink = file.link.replace('/view', '/preview');

                        return (
                            <div
                                key={file._id}
                                className="card"
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    maxWidth: '250px', // Fixed size for cards
                                    margin: '0 auto',
                                }}
                            >
                                <iframe
                                    src={embedLink}
                                    className="card-preview"
                                    title={file.title}
                                    allow="fullscreen"
                                    sandbox="allow-scripts allow-same-origin"
                                    style={{
                                        width: '100%',
                                        height: '180px', // Reduced iframe height
                                        border: 'none',
                                    }}
                                ></iframe>
                                <h3
                                    className="card-title"
                                    style={{
                                        margin: '10px 0',
                                        fontSize: '13px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <strong>{file.title}</strong>
                                </h3>
                                <button
                                    className="btn"
                                    onClick={() => window.open(file.link, '_blank')}
                                    style={{
                                        padding: '6px 16px', // Adjusted button size
                                        fontSize: '12px', // Reduced font size
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'block',
                                        margin: '10px auto',
                                    }}
                                >
                                        Read more
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <p>No policies available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default PublicEnviPolicies;
