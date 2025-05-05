const devConfig = require('./dev')
const testCondif = require('./test')

let env = process.env.NODE_ENV
let envConfig = {};
if(env === 'dev') envConfig = devConfig
else if(env === 'test') envConfig = testCondif


const getEnv = function(){
    if(env === 'dev') return 'dev'
    else if(env === 'test') return 'test'
    return 'live'
}

const isLive = function(){
    if(['live'].indexOf(getEnv())===-1) return false
    return true
}

module.exports ={...envConfig,env,getEnv,isLive}