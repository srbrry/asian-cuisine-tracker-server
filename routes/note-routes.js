const express = require('express')
const router = express.Router()

const Campaign = require('../models/campaign')
const { handle404 } = require('../lib/custom-errors')

const { requireToken } = require('../config/auth')

// CREATE
// POST / notes
router.post('/notes', requireToken, (req, res, next) => {
    const campaignId = req.body.note.campaignId

    const note = req.body.note
    // adding an owner field
    note.owner = req.user._id

    // find the campaign that I want to add the note to
    // once found push the note into the mongoose array
    // send status of 202 crated if success
    // next if failure
    Campaign.findById(campaignId)
      .then(handle404)
      .then(campaign => {
        campaign.notes.push(note)

        return campaign.save()
      })
      .then(campaign => {
        res.status(201).json({ campaign: campaign})
      })
      .catch(next)
})

// UPDATE
// PATCH /notes/:id
router.patch('/notes/:noteId', (req, res, next) => {
    const campaignId = req.body.note.campaignId

    const note = req.body.note

    Campaign.findById(campaignId)
        .then(handle404)
        .then(campaign => {
            const note = campaign.notes.id(req.params.noteId)

            note.set(noteBody)


            return campaign.save()
        })
        .then(() => res.sendStatus(204))
})

// DELETE
router.delete('/notes/:noteId', (req, res, next) => {
    const campaignId = req.body.note.campaignId

    Campaign.findById(campaignId)
        .then(handle404)
        .then(campaign => {
            campaign.notes.id(req.params.noteId).remove()

            // since I've modified I have to save
            campaign.save()
        })
})

module.exports = router
