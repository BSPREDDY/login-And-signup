const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./db')

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    if (!name || !password) {
        return res.status(400).json({ msg: 'Name and password are required' });
    }

    try {
        const user = await User.findOne({name});
        if (!user) {
            res.status(400).json({ msg: 'Invalid username or password' });
        }

        const isPassword = await user.comparePassword(password);
        if(!isPassword){
            res.status(400).json({ msg: 'Invalid username or password' });
        }
        res.status(200).json({ msg: 'Login success' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

app.post('/signup', async (req, res) => {
    const { name, email, number, password } = req.body;

    if (!name || !email || !number || !password) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        const exist = await User.findOne({ $or: [{ email }, { number }] });

        if (exist) {
            return res.status(409).json({ msg: 'User already has an account' });
        }

        const newUser = new User({ name, email, number, password });
        await newUser.save();

        res.status(201).json({ msg: 'Signup successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
