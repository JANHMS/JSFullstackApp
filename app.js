const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')(session)
const app = express()
const markdown = require('marked')
const sanitizeHTML = require('sanitize-html')
let sessionOptions = session({
  secret: "JavaScript is sooooooooo coool",
  store: new MongoStore({client: require('./db')}),
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})

app.use(sessionOptions)
app.use(flash())

app.use(function(req, res, next){
  //make markdown avaiable from ejs templates
  res.locals.filterUserHTML = function(content){
    return sanitizeHTML(markdown(content), {allowedTags:['p','br', 'li', 'i', 'bold', 'h1', 'strong', 'em'], allowedAtributes:{}})


  }

  //make all eerror and scsses form all templates
  res.locals.errors = req.flash('errors')
  res.locals.success = req.flash('success')

  //make current user id available on the request ObjectID
  if(req.session.user) {req.visitorId = req.session.user._id} else {req.visitorId = 0}

  // make user session data available from within view templates
  res.locals.user = req.session.user//we can acsress this from templates
  next()//have acces to user properties from any our ejs templates
})

const router = require('./router')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

module.exports = app
