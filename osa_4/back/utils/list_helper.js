const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  return blogs.reduce((currentLikes, blog) => currentLikes + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  return blogs.reduce((prev, current) =>
    prev.likes > current.likes
      ? {
          title: prev.title,
          author: prev.author,
          likes: prev.likes,
        }
      : {
          title: current.title,
          author: current.author,
          likes: current.likes,
        }
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
