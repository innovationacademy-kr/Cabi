#!/usr/bin/env node
import dotenv from 'dotenv'

import debug from 'debug'
debug("backend:server")
import http from 'http'
import { app } from '../app'

const env = process.env;
if (env.USER === 'ec2-user' && env.PORT === '4242'){
		dotenv.config({ path: '/home/ec2-user/git/42cabi/backend/.env' }); //dep
}else if (env.USER === 'ec2-user') {
		dotenv.config({ path: '/home/ec2-user/git/42cabi-dev/backend/.env' }); //dev
}else{
    dotenv.config(); //local
}

var port = normalizePort(env.PORT || "4242");
app.set("port", port);

var server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val :any) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

function onError(error :any) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
    debug("Listening on " + bind);
}
