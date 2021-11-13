'use strict'

const Router = require('koa-router')
const controller = require('./controller')


const router = new Router()

router.get(['/', '/ping'], ctx => ctx.body = 'pong')
/**
 * returns a varient to use for the given tested entity in the given experiment
 */
router.get('/varient/:experimentName/:testedEntityType/:testedEntityId', async ctx => await controller.getVarient(ctx))


/**
 * logs an event occurence for the relevant experiments
 */
router.post('/event', async ctx => await controller.logEvent(ctx))


module.exports = { router }
