const {Schema, model} = require('mongoose')

const schema = new Schema ({
    name: {type: String, required: true},
    description: {type: String},
    year: {type: Number},
    month: {type: Number},
    day: {type: Number},
    startTime: {
        hours: {type: Number},
        minutes: {type: Number},
    },
    endTime: {
        hours: {type: Number},
        minutes: {type: Number},
    }
})

module.exports = model('Event', schema)