const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const saltRounds = 10;

        const existingUser = await userModel.findOne({ email });
        if(existingUser) return res.status(404).json({ message: 'This user account already exists. Please go to the login page' })

        const hashedPassword = await bcrypt.hash(password, saltRounds)

        await userModel.create({ name, email, password: hashedPassword })

        res.status(200).json({ message: 'User was created successfuly' })
    } catch (err) {
        res.status(404).json({ message: 'Server error, please try again' })
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if(!existingUser) return res.status(404).json({ message: "This user was not found. Please create an account" })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) return res.status(404).json({ message: "Invalid credentials were entered" });

        res.status(200).json({ existingUser })
    } catch (err) {
        res.status(404).json({ message: 'Server error, please try again' })
    }
}) 

module.exports = router;