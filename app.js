const express = require('express')
const cors = require('cors')
// require('dotenv').config();
require('./db/conn')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product')
const stripeRoutes = require('./routes/stripe')
const userRoutes = require('./routes/user')

const app = express()

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 9000;

app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', stripeRoutes);
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})
