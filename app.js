const express = require('express')
const path = require('path')

const app = express()


// Static files
app.use(express.static(path.join(__dirname, '/public')))

// Set ejs as templating engine
app.set('view engine', 'ejs')

// Add todo router
const todoRouter = require('./routes/todo')
app.use('/', todoRouter)

// Main route
app.get('/', (req, res) => {
    res.render('index')
})


// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))