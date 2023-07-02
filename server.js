const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

let blogPostsArray = [];

function generateUniqueKey(n) {
  var characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var key = "";
  for (var i = 0; i < n; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return key;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  res.redirect("/posts");
});

app.get("/posts", (req, res) => {
  //   console.log(blogPostsArray);
  res.render("posts", { blogPosts: blogPostsArray });
});

app.post("/posts", (req, res) => {
  console.log(res.statusCode);
  if (res.statusCode === 200) {
    const { title, content } = req.body;
    blogPostsArray.push({ id: generateUniqueKey(5), title, content });
    res.redirect("/posts");
  } else {
    console.log("An error " + res.statusCode + " occurred");
  }
});

// DELETE route to delete a specific blog post by ID
app.post("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    // Find the blog post by ID
    const findById = (array, id) => array.find((obj) => obj.id === id);
    const foundBlogPost = await findById(blogPostsArray, postId);
    console.log(foundBlogPost);

    // Check if the blog post exists
    if (!foundBlogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Delete the blog post
    const filterDeletedHandler = (array, id) =>
      array.filter((obj) => obj.id != id);
    const filteredArray = filterDeletedHandler(blogPostsArray, postId);
    blogPostsArray = await filteredArray;
    console.log(blogPostsArray);

    //   Send a success response
    res.redirect("/posts");
    // res.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    //   // Handle any errors that occur
    res.status(500).json({ error: "Internal server error" });
  }
});

// // Delete a blog post
// app.delete("/posts/:id", (req, res) => {
//   const { postId } = req.params;
//   const index = blogPostsArray.findIndex((post) => post.id === postId);
//   if (index === -1) {
//     return res.status(404).json({ error: "Blog post not found" });
//   } else {
//     const filterDeletedHandler = (array, id) =>
//       array.filter((obj) => obj.id != id);
//     const filteredArray = filterDeletedHandler(blogPostsArray, postId);
//     blogPostsArray = filteredArray;
//     res.redirect("/posts");
//     res.json({ message: "Blog post deleted successfully" });
//   }
// });

//The 404 Route
app.get("*", function (req, res) {
  res.status(404).send("WHAT??? 404 Page doesn't exist!");
  return;
});

app.listen(3000, () => console.log("Server is running on Port 3000!"));
