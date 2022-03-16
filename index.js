const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
const port = 3000

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    })
})
// For the verifyToken We have to create a middleware
app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'theRoyalBengalTiger', (error, authData) => {
        if (error) {
            res.sendStatus(403)
        } else {
            res.json({
                message: 'Post created successfully!',
                authData
            })
        }
    })
})
// First, we need a way to get the token then implement the token to the post api
app.post('/api/login', (req, res) => {
    // Mock User
    const user = {
        id: 1,
        name: 'Joynal Abedin',
        email: 'joynal@example.com'
    }
    // We can set the token to expire 
    jwt.sign({
        user: user
    }, 'theRoyalBengalTiger', { expiresIn: '30 days'}, (err, token) => {
        res.json({
            token
        })
    })
})


// verifyToken middleware
// This a middleware function so it's gonna take in req, res. 
// And We do what we wanna do and we next() to proceed 
function verifyToken(req, res, next) {
    // Get the auth header value
    const bearerHeader = req.headers['authorization']

    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        //   Get token from array
        const bearerToken = bearer[1]
        // Set the token
        req.token = bearerToken
        next()
    } else {
        // Forbidden
        res.sendStatus(403)
    }
}

app.listen(port, () => {
    console.log(`Server started in port: ${port}`)
})