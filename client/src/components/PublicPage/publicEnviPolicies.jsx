import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PublicEnviPolicies = () => {
    const [files, setFiles] = useState([]);

    //Fetch files from the backend
    const fetchFiles = async () => {
        try {
            const response = await axios.get('/api/files'); //Backend endpoint to fetch files
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files:', error.message);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div className="public-policies-container" style={{ width: '100%', margin: '0 auto' }}>
            <div className="card-row" style={{ margin: '10px 0' }}>
                {files.length > 0 ? (
                    files.map((file) => {
                        //Generate embeddable preview link
                        const embedLink = file.link.replace('/view', '/preview');

                        return (
                            <div key={file._id} className="card" style={{ border: '1px solid #ccc', borderRadius: '5px' }}>
                                <div className="card-content">
                                    <iframe
                                        src={embedLink}
                                        className="card-preview"
                                        title={file.title}
                                        allow="fullscreen"
                                        sandbox="allow-scripts allow-same-origin"
                                        style={{ width: '320px', height: '300px', margin: '20px 0' }} // Increase the height here
                                    ></iframe>
                                    <h3 className="card-title" style={{ margin: '10px 10px' }}><strong>{file.title}</strong></h3>
                                    <button
                                        className="btn"
                                        onClick={() => window.open(file.link, '_blank')}
                                        style={{ padding: '10px 20px', marginBottom: '15px' }}
                                    >
                                        Read more
                                    </button>
                                </div>
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
