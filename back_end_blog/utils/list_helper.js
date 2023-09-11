const dummy = (blogs) => {
    ///...
    return(
        1
    );
};

const totalLikes = (blogs) => {
  
  if (blogs.length === 1) {
    return blogs[0].likes;
  } 
  else if (blogs.length === 0) {
    return 0;
  } 
  else {
    return blogs.map(num => num.likes).reduce((acum, current) => acum + current);
  }
};

const favoriteBlog = (blogs) => {
      if (blogs.length === 1) {
        const {__v, url, _id, ...singleBlog } = blogs[0];
        return singleBlog;
      } 
      
      else if (blogs.length === 0) {
        return "none";
      } 

      else { // blog list is more than one or not 0 
        const result = blogs.reduce((max, current) => {
          return current.likes > max.likes ? current : max;
        }, { likes: 0});

        const {__v, url, _id, ...singleBlog } = result;

        return singleBlog;
      }  
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};