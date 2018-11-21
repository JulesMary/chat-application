
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const debug = require('debug')('backend:server');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('config');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const chatroomRouter = require('./routes/chatrooms');
const mongoose = require('mongoose');
const token = require('./security/token');
const chatroomService= require("./services/chatroomService");


const app = express();

process.env['NODE_CONFIG_DIR'] = './config';

mongoose.connect(config.dbHost, {
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', function() {
    debug('succesfully loaded database');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//don't show the log when it is in test mode
if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(logger('combined'));
}

/**
 * Use some middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Disable CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

/**
 * define your endpoints
 */
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/chatroom', chatroomRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';

const io = require('socket.io').listen(app.listen(port));

let userId = 0;
let connections = [];

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    userId += 1;
    socket.emit('start', {userId} );
    socket.on('message', async (data) => {
        const user = await token.verify(data.token);
        const chatroom = data.chatroom;

        //store message to chat
        chatroomService.storeMessageToChatroom(data.message, data.user, chatroom).then((result) => {
            //console.log('successfully stored ' + result);
        }).catch((err) => console.log(err));

        connections.forEach( (connectedSocket) => {
            if (connectedSocket !== socket) {
                connectedSocket.emit('message', {message: data.message, user: data.user});
            }
        });
    });

    socket.on('disconnect', () => {
        const index = connections.indexOf(socket);
        connections.splice(index, 1);
    });
});

// export for testing
module.exports = app;