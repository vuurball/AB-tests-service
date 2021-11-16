'use strict'

const Router = require('koa-router')
const controller = require('./controller')
const router = new Router({prefix: '/api'})


router.get(['/', '/ping'], ctx => ctx.body = 'pong')

/**
 * returns a list of currently active experiments
 * example response:
 * [{"name":"btn_color","default_variant_name":"control"},{"name":"login_form","default_variant_name":"control"}]
 */
router.get('/experiment/active', async ctx => await controller.getActiveExperiments(ctx))

/**
 * returns a variant to use for the given tested entity in the given experiment
 * example response: 
 * {"variant":"green_btn"}
 */
router.get('/variant/:experimentName/:testedEntityType/:testedEntityId', async ctx => await controller.getVariant(ctx))

/**
 * logs an event occurrence for the relevant experiments
 * example response: OK
 */
router.post('/event', async ctx => await controller.logEvent(ctx))



module.exports = { router }
