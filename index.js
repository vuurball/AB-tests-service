'use strict'

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
require('dotenv').config()
const { router } = require('./routes')



const app = new Koa()

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`) 
  })
  


