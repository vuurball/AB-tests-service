'use strict'

const Experiment = require('./models/Experiment')
const TestObject = require('./models/TestObject')
const Variant = require('./models/Variant')
const TestObjectEvent = require('./models/TestObjectEvent')


/**
 * returns a variant to use for the given tested entity in the given experiment
 */
exports.getVariant = async (ctx) => {
  const { experimentName, testedEntityType, testedEntityId } = ctx.params
  let variantToUse = 'control' // the default
  try {
    const experiment = await Experiment.findByName(experimentName)
    if (experiment) {
      const now = Math.floor(new Date() / 1000)
      if (experiment.is_active == 1 && experiment.start_at < now && now < experiment.end_at ) {
        const testObject = await TestObject.findExistingTestObject(experiment.id, testedEntityType, testedEntityId)
        if (testObject) {
          const variant = await Variant.findById(testObject.variant_id)
          if (variant) {
            variantToUse = variant.name
          }
        } else {
          const selectedVariant = await Variant.getVariantToAssign(experiment.id)
          TestObject.createNewTestObject(experiment.id, testedEntityType, testedEntityId, selectedVariant.id)
          variantToUse = selectedVariant.name
        }
      } else {
        // experiment is not running (hasn't started or fininshed) 
        // returning the default that is defined for this experiment
        variantToUse = experiment.default_variant_name
      }
    }
  } catch (err) {
    console.log(err)
  }
  ctx.body = { variant: variantToUse }
}


/**
 * @returns a list of currently active experiments
 */
exports.getActiveExperiments = async (ctx) => {
  ctx.body = await Experiment.findAllActive()
}


/**
 * logs an event occurrence for the relevant experiments
 * @param {string} eventName - the event that happened
 * @param {string|int} testedEntityType - the entity type that triggered the event and is being tested (i.e user|lead|visitor|etc)
 * @param {string|int} testedEntityId - the entity type id (i.e user id| lead id| visitor id| etc)
 * @param {string|object} eventData - optional data for tracking/analizing - (i.e if lead x triggered 'register' event, the registered user-id can be saved)
 */
exports.logEvent = async (ctx) => {
  const { eventName, testedEntityType, testedEntityId, eventData } = ctx.request.body
  TestObjectEvent.logEvent(eventName, testedEntityType, testedEntityId, eventData)
  ctx.body = 'OK'
}