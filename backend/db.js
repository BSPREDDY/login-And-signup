const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
mongoose.connect('mongodb+srv://bspreddy:bspreddy%402003@cluster0.dgx863o.mongodb.net/')
    .then(() => console.log("connected to the database🤝"))
    .catch(() => console.log("some thing is happend to your server🚫"))

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    number: {
        type: String,
        unique: true,
        match: [/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'],
        require: true
    },
    email: {
        type: String,
        unique: true,
        requir: true,
        match: [/^[\w.-]+@(gmail\.com|email\.com)$/, 'Email must be a Gmail or Email.com address']
    }
})

// ✅ Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if password not changed
    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash password
        next();
    } catch (err) {
        next(err);
    }
});

// ✅ Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema)

module.exports = User