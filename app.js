require('dotenv').config({ override: true});
const express = require('express');
const app = express();
const path = require('path');
const middleware = require('./middleware');
const bodyParser = require("body-parser");
const mongoose = require('./database');
const session = require('cookie-session');

const port = process.env.PORT || 3003;

const server = app.listen(port, () => {
 
    console.log("server listening on port : " + port);
})

const io = require("socket.io")(server, { pingTimeout: 60000 });

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public"))); 
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: false
}));

//routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logout');
const postRoute = require('./routes/postRoutes');
const profileRoute = require('./routes/profileRoutes');
const uploadRoute = require('./routes/uploadRoutes');
const searchRoute = require('./routes/searchRoutes');
const messagesRoute = require('./routes/messagesRoutes');
const notificationsRoute = require('./routes/notificationRoutes');

//api routes
const postsApiRoutes = require('./routes/api/posts');
const usersApiRoutes = require('./routes/api/users');
const chatsApiRoutes = require('./routes/api/chats');
const messagesApiRoutes = require('./routes/api/messages');
const notificationsApiRoutes = require('./routes/api/notifications');

app.use("/login",loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use("/posts", middleware.requireLogin, postRoute);
app.use("/profile", middleware.requireLogin, profileRoute);
app.use("/uploads", uploadRoute);
app.use("/search", middleware.requireLogin, searchRoute);
app.use("/messages", middleware.requireLogin, messagesRoute);
app.use("/notifications", middleware.requireLogin, notificationsRoute);

app.use("/api/posts",postsApiRoutes);
app.use("/api/users",usersApiRoutes);
app.use("/api/chats",chatsApiRoutes);
app.use("/api/messages",messagesApiRoutes);
app.use("/api/notifications",notificationsApiRoutes);

app.get("/",middleware.requireLogin, (req, res)=>{
    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user)
    }
    res.status(200).render("home", payload);
 })

 io.on("connection", (socket)=>{
     socket.on("setup", userData => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join room", room => socket.join(room));
    socket.on("typing", room => socket.in(room).emit("typing")); 
    socket.on("stop typing", room => socket.in(room).emit("stop typing")); 
    socket.on("notification received", room => socket.in(room).emit("notification received")); 

    socket.on("new message", newMessage => {
        var chat = newMessage.chat;

        if(!chat.users) return console.log("Chat.users not defined");

        chat.users.forEach(user => {
            if(user._id == newMessage.sender._id) return;
            socket.in(user._id).emit("message received", newMessage);
        })
    })
});