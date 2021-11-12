'use strict'

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const { router } = require('./routes')


const app = new Koa()

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000, () => {
    console.log('listening on port 3000') 
  })
  


