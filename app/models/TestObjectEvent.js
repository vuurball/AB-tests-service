const { dbcon, Sequelize } = require('../db')
const { DataTypes, Model } = Sequelize
const { getSchema } = require('./schemas/TestObjectEvent')


class TestObjectEvent extends Model {


  static async logEvent(eventName, testedEntityType, testedEntityId, eventData) {
    const relevantTestObjects = await this.getTrackedTestObjects(eventName, testedEntityType, testedEntityId)
    relevantTestObjects.map(testObj => {
      this.addNew(testObj.id, testObj.event_id, eventData)
    })
  }


  static async addNew(test_obj_id, event_id, event_data) {
    return await this.create({
      test_obj_id,
      event_id,
      event_data: JSON.stringify(event_data),
    })
  }


  /**
   * when an event happened to a given entity, 
   * we find to which active experiments this event is relevant
   * and find the existing Test Objects that are being tracked for thiose experiments and this entity
   * note: same entity can be tested in multiple experiments at the same time, and multiple experiments can track the same events
   */
  static async getTrackedTestObjects(eventName, testedEntityType, testedEntityId) {
    const sql = 
      `SELECT objs.id, ev.id as event_id
      FROM events ev 
      INNER JOIN experiments_events e_e ON e_e.event_id = ev.id
      INNER JOIN experiments ex ON ex.id = e_e.experiment_id
      INNER JOIN test_objects objs ON objs.experiment_id = ex.id
      WHERE ev.name = :eventName
        AND ex.is_active = 1
        AND ex.start_at < :now
        AND ex.end_at > :now
        AND objs.tested_entity_type = :testedEntityType
        AND objs.tested_entity_id = :testedEntityId`

    const res = await dbcon.query(sql, { 
      replacements: { eventName, testedEntityType, testedEntityId, now: (Math.floor(new Date() / 1000)) },
      type: Sequelize.QueryTypes.SELECT
    })
    return res
  }
}



console.log('Initialize table structure TestObjectEvent')
const { schema, options } = getSchema(dbcon, DataTypes)
TestObjectEvent.init(schema, options)

module.exports = TestObjectEvent