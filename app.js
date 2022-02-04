const express = require('express')
const mustacheExpress = require('mustache-express')
const session = require('express-session')
const app = express() 
const pgp = require('pg-promise')()


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

const connectionString = 'postgres://wlpsgjzx:E6aL9hebBwoK-Vv_fIrIkbDAQnKMfeD-@castor.db.elephantsql.com/wlpsgjzx'

app.get('/', (req, res) => {
    res.render('index')
})