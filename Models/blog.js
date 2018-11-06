class Blog{
  constructor(blogid,name,title,content){
    this.blogid = blogid
    this.name = name
    this.title = title
    this.content = content
    this.comments = []
  }
}

module.exports = Blog
