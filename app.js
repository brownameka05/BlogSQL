const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express()
var session = require('express-session')
const pgp = require('pg-promise')()
const connectionString = "postgres://localhost:5432/blogsdb"
const db = pgp(connectionString)

let username = [
  {username : "AmekaBrown", password : "password"}
]

let blogs = []

app.use(session({
  secret: 'cat',
  resave: false,
  saveUninitialized: false
}))


app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

app.use(bodyParser.json())

app.post("/login", function(req,res){
  let username = req.body.username
  let password = req.body.password
  if(username == "AmekaBrown" && password == "password"){
    if(req.session){
      req.session.username = username
      res.redirect("/blogs")
    }
  }
})

app.get("/login", function (req,res){
  res.render("login")
})




app.post('/deleteAPost', function(req,res){
  let blogid = req.body.blogid

  db.none('DELETE FROM blogs WHERE blogid = $1;',[blogid])
  .then(function(){
    res.redirect('/blogs')
  })
})


app.post('/blogs', function(req,res){
  let name = req.body.name
  let title = req.body.title
  let content = req.body.content

  db.none('INSERT INTO blogs(name,title,content) VALUES($1,$2,$3)',[name,title,content])
  .then(function(){
    res.redirect('/blogs')
  })
})
// app.get('/blogs/new',function(req,res){
//   res.render('add-blog')
// }) this will take u to the new page for adding blog ....don't need just keep on same page


app.get('/blogs', function(req,res){
  db.any('SELECT blogid,name,title,content FROM blogs;')
  .then(function(result){
    console.log(result)
    res.render('blogs', {blogs : result})

  })
})






app.listen(3000,function(req,res){
  console.log("Blog Server is running..")

})
