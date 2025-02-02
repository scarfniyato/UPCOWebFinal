import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MdAccountCircle, MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
axios.defaults.baseURL = 'http://localhost:3001'; // Point to the backend server
import './style.css'; // Add styling as needed

const EnviPolicy = () => {
    const [files, setFiles] = useState([]); // Ensure it's initialized as an array
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('/api/files');
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files:', error.message);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    //For multiple file select to upload
    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (files.length === 0) return alert('Please select at least one file to upload.');
        setIsUploading(true); // Disable the button

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                await axios.post('/api/files/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            alert('Files uploaded successfully!');
            setFiles([]); // Clear selected files
            fileInputRef.current.value = ''; // Reset the file input field
            fetchFiles(); // Refresh the file list
        } catch (error) {
            console.error('Error uploading files:', error.message);
            alert('Failed to upload files.');
        } finally {
            setTimeout(() => setIsUploading(false), 2000); // Re-enable after 2 seconds
        }
    };

    const handleDelete = async (id) => {
        console.log('Deleting file with ID:', id); // Debug log for ID
        const confirmDelete = window.confirm('Are you sure you want to delete this file?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/files/${id}`);
            alert('File deleted successfully!');
            fetchFiles(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting file:', error.response?.data || error.message);
            alert('Failed to delete file.');
        }
    };
    console.log("EnviPolicy component rendered");
    
    return (
        
        <div className="envi-policy-container">
                <div className='flex gap-x-64 w-full'>
                    <div className='flex-1 flex items-center head'>Public Page Management</div>
                    <div className='items-center flex-none'><Link to="/accountmanagement"><MdAccountCircle size={50}/></Link></div>
                </div>

                <div className='Main Box bg-white mt-11 p-6 rounded-2xl shadow-lg'>
                    <div className='fbold mb-3 text-lg'>Environmental Management Policies<hr/></div>
                    <div className='font-main flex items-center justify-center'>
                        <table className="files-table w-full border-separate">
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Uploaded File</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.length > 0 ? (
                                    files.map((file) => (
                                        <tr key={file._id}>
                                            <td>{file.title}</td>
                                            <td>
                                                <a href={file.link} target="_blank" rel="noopener noreferrer">
                                                    View File
                                                </a>
                                            </td>
                                            <td>{new Date(file.date).toLocaleDateString()}</td> {/* Format the date */}
                                            <td>
                                                <button onClick={() => handleDelete(file._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No files uploaded yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        </div>

                        <div className='mt-16'>
                            <h2 className='fbold mb-3 text-lg'>Add Environmental Management Policy<hr/></h2>
                            <form onSubmit={handleFileUpload} className="upload-form text-dark"></form>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    multiple // Allow multiple file selection
                                    onChange={handleFileChange}
                                    ref={fileInputRef} // Attach the reference for resetting
                                    className='bg-lblue py-2 px-5 rounded-full'
                                />
                                <button type="submit" disabled={isUploading} className='bg-dark text-white py-2 px-5 rounded-full'>
                                    {isUploading ? 'Uploading...' : 'Add File'}
                                </button>
                        </div>
                    </div>
                </div>
    );
};

export default EnviPolicy;
