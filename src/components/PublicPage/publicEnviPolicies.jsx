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
        <div className="public-policies-container">
            <h1>Environmental Policies</h1>
            <div className="card-grid">
                {files.length > 0 ? (
                    files.map((file) => {
                        //Generate embeddable preview link
                        const embedLink = file.link.replace('/view', '/preview');

                        return (
                            <div key={file._id} className="card">
                                <div className="card-content">
                                    <iframe
                                        src={embedLink}
                                        className="card-preview"
                                        title={file.title}
                                        allow="fullscreen"
                                    ></iframe>
                                    <h3 className="card-title">{file.title}</h3>
                                    <button
                                        className="read-more-btn"
                                        onClick={() => window.open(file.link, '_blank')}
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

