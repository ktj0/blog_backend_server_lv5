const express = require("express");
const cookiParser = require("cookie-parser");

const usersRouter = require("./routes/users.route");
const postsRouter = require("./routes/posts.route");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookiParser());

app.use("/api", [usersRouter, postsRouter]);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸습니다.");
});
