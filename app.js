const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express()
var session = require('express-session')
const pgp = require('pg-promise')()
const connectionString = "postgres://localhost:5432/blogsdb"
const db = pgp(connectionString)


let blogs = []






app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

app.use(bodyParser.json())



app.get('/blogs/:blogid',function(req,res){
  let blogid = req.params.blogid

  db.any('SELECT title,comment FROM reviews WHERE blogid = $1;',[blogid])
  .then(function(results){
    console.log(results)
    res.render('blog-comments', {blogid: blogid,reviews : results})
  })
})



app.post('/blogs/:blogid', function(req,res){
  let title = req.body.title
  let comment = req.body.comment
  let blogid = req.body.blogid
  db.none('INSERT INTO reviews(title,comment,blogid) VALUES($1,$2,$3)',[title,comment,blogid])
  .then(function(){
    res.redirect('/blogs/'+ blogid)
  })
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
