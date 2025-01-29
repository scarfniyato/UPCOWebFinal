const express = require('express');
const router = express.Router();
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const File = require('../models/File');

//Multer setup for temporary file uploads
const upload = multer({ dest: 'uploads/' });

//Google Drive API setup
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });
const FOLDER_ID = '1gWUDsimvHzMd3wkKoueBvEIc-8cJ19rE'; 

//Upload file
router.post('/upload', upload.array('file', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            const filePath = file.path;

            //Upload each file to Google Drive
            const response = await drive.files.create({
                requestBody: {
                    name: file.originalname,
                    parents: [FOLDER_ID],
                },
                media: {
                    mimeType: file.mimetype,
                    body: fs.createReadStream(filePath),
                },
            });

            const fileId = response.data.id;

            //Make file publicly accessible
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            const fileLink = `https://drive.google.com/file/d/${fileId}/view`;

            //Save metadata to MongoDB
            const newFile = new File({
                title: file.originalname,
                link: fileLink,
                driveId: fileId,
                date: new Date(),
            });
            await newFile.save();

            //Remove the local file
            fs.unlinkSync(filePath);

            uploadedFiles.push(newFile);
        }

        res.status(201).json(uploadedFiles); //Send metadata of all uploaded files as response
    } catch (error) {
        console.error('Error uploading files:', error.message);
        res.status(500).send('Error uploading files.');
    }
});

//Fetch all files
router.get('/', async (req, res) => {
    try {
        const files = await File.find(); //Fetch files from MongoDB
        res.json(files);
    } catch (error) {
        console.error('Error fetching files:', error.message);
        res.status(500).send('Error fetching files.');
    }
});

//Delete a file
router.delete('/:id', async (req, res) => {
    try {
        console.log('Received delete request for file ID:', req.params.id);

        const file = await File.findById(req.params.id);
        if (!file) {
            console.error('File not found in database.');
            return res.status(404).send('File not found.');
        }

        console.log('File found in database:', file);

        try {
            console.log('Deleting file from Google Drive.');
            await drive.files.delete({ fileId: file.driveId });
        } catch (error) {
            console.error('Error deleting file from Google Drive:', error.message);
        }

        console.log('Deleting file metadata from MongoDB.');
        await File.deleteOne({ _id: req.params.id });

        res.send('File deleted successfully.');
    } catch (error) {
        console.error('Error during file deletion:', error.message);
        res.status(500).send('Error deleting file.');
    }
});


router.get('/test-drive-permissions', async (req, res) => {
    try {
        const response = await drive.files.list({
            pageSize: 1,
            fields: 'files(id, name)',
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error testing Google Drive permissions:', error.message);
        res.status(500).send('Google Drive permission error.');
    }
});


module.exports = router;





