const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express()
const pgp = require('pg-promise')()
const connectionString = "postgres://localhost:5432/blogsdb"
const db = pgp(connectionString)


app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

app.use(bodyParser.json())

// app.post('/blogs', function(req,res){
//   let blogid = req.body.blogid
//
//   db.none
// })




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
