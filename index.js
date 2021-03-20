const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

const users = []

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', async (req, res) => {

    try {
        // const salt = await bcrypt.genSalt() // here the default value passed to genSalt() is 10
        // const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const hashedPassword = await bcrypt.hash(req.body.password, 10) // this single code does the work of the above codes

        const user = {
            name: req.body.name,
            password: hashedPassword
        }
        users.push(user)
        res.status(201).send(users)
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name = req.body.name)
    if (user == null) return res.status(400).send('Cannot find user')

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else {
            res.send('Not allowed')
        }
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

app.listen(8000, () => {
    console.log('listening on port 8000')
})