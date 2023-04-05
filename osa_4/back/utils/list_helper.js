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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  const blogCounts = {}
  blogs.forEach((blog) => {
    if (blog.author in blogCounts) {
      blogCounts[blog.author] = blogCounts[blog.author] + 1
    } else {
      blogCounts[blog.author] = 1
    }
  })

  return Object.entries(blogCounts).reduce((prev, current) =>
    prev[1] > current[1]
      ? {
          author: prev[0],
          blogs: prev[1],
        }
      : {
          author: current[0],
          blogs: current[1],
        }
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
