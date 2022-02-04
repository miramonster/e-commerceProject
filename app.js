const express = require('express')
const mustacheExpress = require('mustache-express')
const session = require('express-session')
const models = require('./models')
const app = express() 
const pgp = require('pg-promise')()
const bcrypt = require('bcrypt')
const SALT_ROUND = 10

// setting up Express to use Mustache Express as template pages 
app.engine('mustache', mustacheExpress())
// the pages are located in views directory
app.set('views', './views')
// extension will be .mustache
app.set('view engine', 'mustache')

app.use(session({
    secret: 'THISSECRETKEY',
    saveUninitialized: true,
    resave: true
}))

app.use(express.urlencoded())
app.use(express.static('static'))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req,res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/login', async (req,res) => {
    const username = req.body.usernameText
    const password = req.body.passwordText

    let user = await models.User.findOne({
        where: {
            username: username
        }
    })

    if(user!=null) {
        bcrypt.compare(password, user.password, (error,result) => {
            if(result) {
                if(req.session) {
                    req.session.user = {userId: user.id}
                    req.session.userId = user.id
                    req.session.username = user.username
                
                    res.redirect('/blog/dashboard')
                }
            } else {
                res.render('/', {errorMessage: 'Incorrect Password'})
            }
        })
    } else {
        res.render('/', {errorMessage: 'Username invalid'})
    }
})


app.post('/register', async (req, res) => {
    const username = req.body.usernameText
    const password = req.body.passwordText

    let persistedUser = await models.User.findOne({
        where: {
            username:username
        }
    })

    if(persistedUser == null) {

        bcrypt.hash(password, SALT_ROUND, async (error, hash) => {
            if(error) {
                res.render('register', {errorMessage:'Error creating user'})
            } else {
                let user = models.User.build({
                    username:username,
                    password:hash
                })

                let savedUser = await user.save()
                if(savedUser != null) {
                    res.redirect('/')
                } else {
                    res.render('register', {errorMessage:"Username Already Exists!"})
                }
            }
        })

    } else {
        res.render('register', {errorMessage:"Username Already Exists!"})
    }

})


app.listen(3000, () => {
    console.log('Server is running...')
})