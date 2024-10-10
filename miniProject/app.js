require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const userModel = require("./models/user.js");
const Post = require("./models/post.js");
const cookieParser = require("cookie-parser");
const app = express();
const { isLoggedIn } = require("./middleware/auth.js");
const mongoose = require("mongoose");


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set(express.static(path.join(__dirname, "public")));

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

connectDb();

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    // console.log(req.body);
    const user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          const createdUser = await userModel.create({
            email,
            name,
            username,
            password: hash,
          });

          const token = jwt.sign(
            { userid: createdUser._id, email: createdUser.email },
            process.env.JWT_KEY
          );

          res.cookie("token", token);

          res.redirect("/profile");
        });
      });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "Something went wrong" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { userid: user._id, email: user.email },
          process.env.JWT_KEY
        );

        res.cookie("token", token);

        res.redirect("/profile");
      } else {
        res.status(404).json({ message: "Something went wrong" });
        return res.redirect("/");
      }
    }
  } catch (error) {
    console.error("Error Logggin :", error);
    res.status(500).json({ message: "Error Login user", error: error.message });
  }
});
app.get("/profile", isLoggedIn, async (req, res) => {
  // const user = await userModel.findOne({_id:req.user._id}).populate('posts');
  const allPosts = await Post.find({}).populate("author");
  res.render("profile", { user: req.user, allPosts });
});
app.post("/post", isLoggedIn, async (req, res) => {
  const { title, content } = req.body;
  const user = await userModel.findOne({ _id: req.user._id });
  const post = await Post.create({
    title,
    content,
    author: user._id,
  });
  await post.save();
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    // console.log(post);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const likeIndex = post.likes.indexOf(req.user._id);
    if (likeIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.redirect("/profile");
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    res.status(500).send("An error occurred");
  }
});

app.get("/delete/:id", isLoggedIn, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // if (!post.author.equals(req.user._id)) {
    //     return res.status(403).send('You are not authorized to delete this post');
    // }

    await Post.findByIdAndDelete(postId);

    await userModel.updateOne(
      { _id: req.user._id },
      { $pull: { posts: postId } }
    );

    res.redirect("/profile");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("An error occurred while deleting the post");
  }
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("edit", { post });
});

app.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { title, content } = req.body;
  const postiId = req.params.id;
  const post = await Post.findByIdAndUpdate(postiId, { title, content });
  await post.save();
  res.redirect("/profile");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
});
