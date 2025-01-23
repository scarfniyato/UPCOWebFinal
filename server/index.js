const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require("bcrypt"); 
const dotenv = require("dotenv"); 
const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken'); 
const connection = require("./db");
const bodyParser = require('body-parser');

//Import your models (if they’re needed in other routes)
//const userModel = require('./models/Users');
//const userModel2 = require('./models/solid_waste');
const userModel3 = require('./models/wastedata');
const userModel4 = require('./models/waterdata');
const userModel5 = require('./models/airdata');
const UserModel = require("./models/User");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset");
const collegesRoute = require('./routes/colleges');
const wasteDataRoute = require('./routes/waste-data-generated');
const fileRoutes = require("./routes/files");

dotenv.config();
const app = express();
connection();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//-------------------- Routes --------------------
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use('/api', collegesRoute);
app.use('/api/waste-data-generated', wasteDataRoute);
app.use('/api', wasteDataRoute);
app.use("/api/files", fileRoutes);

//Error Handling Middleware 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Internal Server Error" });
  });


//-------------------- Connect to MongoDB --------------------
//Use .then/.catch instead of a try/catch around an async call
mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log('Database connected successfully');

  })
  .catch((error) => {
    console.log('Database connection failed:', error);
  });

// -------------------- Route for AddAccount --------------------
app.post("/addAccount", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        //Hash password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });

        //Save new user to database
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------- Route for AdminLogin --------------------
app.post("/admin-login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                res.status(200).json("Success");
            } else {
                res.status(401).json({ error: "Password does not match!" });
            }
        } else {
            res.status(404).json({ error: "No Records Found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



//---------------------------CHARTS---------------------------------

//---------------------------AIR---------------------------------
app.delete('/delete_air/:id', (req, res) => {
    const id = req.params.id;
    userModel5.findByIdAndDelete({_id:id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
})

app.get('/get_air/:id', (req, res) => {
    const id = req.params.id;
    userModel5.findById({_id:id})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.put('/update_air/:id', (req, res) => {
    const id = req.params.id;
    userModel5.findByIdAndUpdate({_id:id}, {
        year: req.body.year,
        month: req.body.month,
        CO: req.body.CO,
        NO2: req.body.NO2,
        SO2: req.body.SO2,
    })
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.get('/airquality_data', async (req, res) => { 
    try {
        const { month, year } = req.query;
        let filter = {};

        if (year) {
            filter.year = parseInt(year, 10);
        }

        if (month) {
            filter.month = month;
        }

        const data = await userModel5.find(filter, {
           _id: 1, 
           year: 1, 
           month: 1, 
           CO: 1,
           NO2: 1, 
           SO2: 1
        });

        res.json(data);
    } catch (err) {
        console.error("Error fetching air quality data:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

app.post("/add_airquality", (req, res) => {
    userModel5.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})


// Add this route to fetch distinct years for air table
app.get('/available_year_air', async (req, res) => {
    try {
        const years = await userModel5.distinct('year');
        res.json(years.sort((a, b) => b - a)); // Sort in descending order
    } catch (err) {
        console.error("Error fetching available years:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

//---------------------------WATER---------------------------------


app.post("/add_waterquality", (req, res) => {
    userModel4.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.get('/available_years', async (req, res) => {
    try {
        const years = await userModel4.distinct('year');
        res.json(years.sort((a, b) => b - a)); // Sort in descending order
    } catch (err) {
        console.error("Error fetching available years:", err);
        res.status(500).json({ error: "Server Error" });
    }
});


app.get('/waterquality_data', async (req, res) => {
    try {
        const { monthRange, year } = req.query;
        let filter = {};

        if (year) {
            filter.year = parseInt(year, 10);
        }

        if (monthRange) {
            // Directly filter by the exact month range string
            filter.month = monthRange;
        }

        const users = await userModel4.find(filter, {
            _id: 1,
            year: 1,
            month: 1,
            source_tank: 1,
            pH: 1,
            Color: 1,
            FecalColiform: 1,
            TSS: 1,
            Chloride: 1,
            Nitrate: 1,
            Phosphate: 1
        });

        res.json(users);
    } catch (err) {
        console.error("Error fetching water quality data:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

app.delete('/delete_water/:id', (req, res) => {
    const id = req.params.id;
    userModel4.findByIdAndDelete({_id:id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
})

app.get('/get_water/:id', (req, res) => {
    const id = req.params.id;
    userModel4.findById({_id:id})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.put('/update_water/:id', (req, res) => {
    const id = req.params.id;
    userModel4.findByIdAndUpdate({_id:id}, {
        year: req.body.year,
        month: req.body.month,
        source_tank: req.body.source_tank,
        pH: req.body.pH,
        Color: req.body.Color,
        FecalColiform: req.body.FecalColiform,
        TSS: req.body.TSS,
        Chloride: req.body.Chloride,
        Nitrate: req.body.Nitrate,
        Phosphate: req.body.Phosphate
    })
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

//---------------------------SOLID WASTE---------------------------------

app.get('/available_year_waste', async (req, res) => {
    try {
        const years = await userModel3.distinct('year');
        res.json(years.sort((a, b) => b - a)); // Sort in descending order
    } catch (err) {
        console.error("Error fetching available years:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

app.post("/add_solidwaste", (req, res) => {
    userModel3.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.get('/filterUsers', (req, res) => {
    const { month, year } = req.query;

    let filter = {};
    if (month) {
        filter.month = month;  // assuming the user model has a 'month' field
    }
    if (year) {
        filter.year = year; // assuming the user model has a 'year' field
    }

    userModel3.find(filter)
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

app.delete('/delete_solidwaste/:id', (req, res) => {
    const id = req.params.id;
    userModel3.findByIdAndDelete({_id:id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
})

app.get('/get_solidwaste/:id', (req, res) => {
    const id = req.params.id;
    userModel3.findById({_id:id})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.put('/update_solidwaste/:id', (req, res) => {
    const id = req.params.id;
    userModel3.findByIdAndUpdate({_id:id}, {
        year: req.body.year,
        month: req.body.month,
        residual: req.body.residual,
        biodegradable: req.body.biodegradable,
        recyclable: req.body.recyclable
    })
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.listen(3001, () => {
    console.log("Sever is Running")
})