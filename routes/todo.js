const router = require('express').Router()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

router.use(bodyParser.urlencoded({ extended: true }))


// Add Todo
router.post('/add-todo', (req, res) => {
    // Get data
    const username = req.body.username;
    const todo = req.body.todo;

    // Checkpoint
    if (!username || !todo) {
        return res.status(400).send('Username and Todo are required.')
    }

    // Init path by username
    const filePath = path.join(__dirname, '../todos', `${username}.txt`)
    
    // Store todo data
    fs.appendFile(filePath, `${todo}\n`, err => {
        // Checkpoint
        if (err) {
            return res.status(500).send('Failed to save todo.')
        }

        res.redirect(`/todos/${username}`)
    })
})

// Delete todo
router.post('/delete-todo', (req, res) => {
    // Get data
    const username = req.body.username;
    const todoToDelete = req.body.todoToDelete;

    // Checkpoint
    if (!username || !todoToDelete) {
        return res.status(400).send('Username and Todo to delete are required.')
    }

    // Init path by username
    const filePath = path.join(__dirname, '../todos', `${username}.txt`)

    // Get current todos
    fs.readFile(filePath, 'utf8', (err, data) => {
        // Checkpoint
        if (err) {
            console.log(`An error occured while opening ${username}.txt`)

            if (err.code === 'ENOENT') {
                return res.render('todos', { username, todos: [] })
            } else {
                return res.status(500).send('Failed to read todo file')
            }
        }

        // Remove todo from Todos array
        let todos = data.split('\n')
        todos = todos.filter(todo => todo !== todoToDelete)

        // Overwrite file
        fs.writeFile(filePath, todos.join('\n') + '\n', err => {
            // Checkpoint
            if (err) {
                console.log(`An error occured while writing on ${username}.txt`)
                return res.status('Failed to delete todo')
            }
            return res.redirect(`/todos/${username}`)
        })
    })
})

// Provide todo for the user
router.get('/todos/:username', (req, res) => {
    // Details
    const username = req.params.username
    const filePath = path.join(__dirname, '../todos', `${username}.txt`)

    // Get File
    fs.readFile(filePath, 'utf8', (err, data) => {
        // Checkpoint
        if (err) {
            console.log(`An error occured while opening ${username}.txt`)

            if (err.code === 'ENOENT') {
                return res.render('todos', { username, todos: [] })
            } else {
                return res.status(500).send('Failed to read todo file')
            }
        }

        // Send
        const todos = data.split('\n')
        res.render('todos', { username, todos })
    })
})


module.exports = router