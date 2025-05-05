const socketIo = require("socket.io");
const { User } = require("../../models");
const  mongoService  = require("../../services/database");

let globalSocketPromise;
let socketConnedted = false;
let ioInstance;

exports.socket = (server) => {
  const io = socketIo(server, {
    cors: "*",
  });

  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("A user Connected");

    socketConnedted = true;

    var newSocketId = socket.id;

    socket.on('on-user-login',async(data)=>{
        let email = data?.email
        let user = await mongoService.getFirstMatch(User,{email:email,isDeleted:false},{},{})
        await mongoService.updateData(User,{_id:user._id},{socketId:newSocketId,isLogin:true},{})
        socket.emit('on-user-login',`success`)
    })

    socket.on('on-user-logout',async(data)=>{
        let email = data?.email
        let user = await mongoService.getFirstMatch(User,{email:email,isDeleted:false},{},{})
        await mongoService.updateData(User,{_id:user._id},{socketId:null,isLogin:false},{})
        socket.emit('on-user-logout',`success`)
    })

    socket.on("disconnect", () => {
      console.log("user Disconnected");

      socketConnedted = false;

      if (globalSocketPromise) {
        globalSocketPromise = null;
      }

      globalSocketPromise = new Promise((resolve, reject) => {
        resolve(io);
      });
    });
  });
};

exports.getGlobalSocketPromise = () => globalSocketPromise;

exports.isSocketConnedted = () => socketConnedted;
