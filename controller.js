'use strict'

const Experiment = require('./models/Experiment')
const TestObject = require('./models/TestObject')
const Variant = require('./models/Variant')


/**
 * returns a varient to use for the given tested entity in the given experiment
 */
exports.getVarient = async (ctx) => {
  const { experimentName, testedEntityType, testedEntityId } = ctx.params
  let varientToUse = 'control' // the default
  try {
    const experiment = await Experiment.findByName(experimentName)
    if (experiment) {
      if (experiment.is_active == 1 /* todo and time within range */) {
        const testObject = await TestObject.findExistingTestObject(experiment.id, testedEntityType, testedEntityId)
        if (testObject) {
          const variant = await Variant.findById(testObject.variant_id)
          if (variant) {
            varientToUse = variant.name
          }
        } else {
          const selectedVariant = await Variant.getVariantToAssign(experiment.id)
          TestObject.createNewTestObject(experiment.id, testedEntityType, testedEntityId, selectedVariant.id)
          varientToUse = selectedVariant.name
        }
      } else {
        // experiment is not running (hasn't started or fininshed) 
        // returning the default that is defined for this experiment
        varientToUse = experiment.default_variant_name
      }
    }
  } catch (err) {
    console.log(err)
  }
  ctx.body = { variant: varientToUse }
}


/**
 * logs an event occurence for the relevant experiments
 */
exports.logEvent = async (ctx) => {
  // todo implement //ctx.request.body
}