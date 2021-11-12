'use strict'

const Router = require('koa-router')
const controller = require('./controller')


const router = new Router()

/**
 * returns a varient to use for the given tested entity in the given experiment
 */
router.get('/varient/:experimentId/:testedEntityType/:testedEntityId', async ctx => await controller.getVarient(ctx))


/**
 * logs an event occurence for the relevant experiments
 */
router.post('/event', async ctx => await controller.logEvent(ctx))


module.exports = { router }
