const {Router} = require('express')
const Event = require('../models/Event')
const {validationResult, query } = require('express-validator')
const router = Router()

router.get(
    '/getEvents',
    [
        query(['startYear', 'endYear']).isLength({min: 4, max: 4}).isInt({min: 1970, max: 2099}).isNumeric({no_symbols: true}),
        query(['startMonth', 'endMonth']).isLength({min: 1, max: 2}).isInt({min: 0, max: 11}).isNumeric({no_symbols: true}),
        query(['startDay', 'endDay']).isLength({min: 1, max: 2}).isInt({min: 0, max: 31}).isNumeric({no_symbols: true}),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect request'
                })
            }
            const {startYear, startMonth, startDay, endYear, endMonth, endDay} = req.query
            const events = await Event.find({
                $or: startYear === endYear
                    ? [
                        {year: startYear, month: startMonth, day: {$gte: startDay}},
                        {year: startYear, month: {$gt: startMonth, $lt: endMonth}},
                        {year: startYear, month: endMonth, day: {$lte: endDay}},
                    ]
                    : [
                        {
                            year: startYear,
                            $or: [
                                {month: startMonth, day: {$gte: startDay}},
                                {month: {$gt: startMonth}},
                            ]
                        },
                        {year: {$gt: startYear, $lt: endYear}},
                        {
                            year: endYear, $or: [
                                {month: {$lt: endMonth}},
                                {month: endMonth, day: {$lte: endDay}},
                            ]
                        }
                    ]
            })
            res.status(201).json({events})
        } catch (e) {
            res.status(500).json({message: 'Something went wrong'})
        }
    })

router.post(
    '/newEvent',
    async (req, res) => {
        try {
            const eventData = req.body
            const newEvent = new Event(eventData)
            await newEvent.save()

            res.status(201).json({event: newEvent})
        } catch (e) {
            res.status(500).json({message: 'Something went wrong'})
        }
    })

router.put(
    '/editEvent',
    async (req, res) => {
        try {
            const eventData = req.body
            const event = new Event(eventData)
            Event.findOneAndUpdate({_id: event._id}, event, (err) => {
                if (err) return res.status(500).json({message: 'Something went wrong', err})
                res.status(201).json({event})
            })
        } catch (e) {
            res.status(500).json({message: 'Something went wrong'})
        }
    })

module.exports = router