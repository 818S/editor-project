import express, { RequestHandler, Response } from 'express'
import { WebsocketRequestHandler } from 'express-ws'
import { Descendant } from 'slate'
import { NOTE_1, NOTE_2 } from '../fixtures/notes'
import { getNote, getNotes, INote, updateNote } from '../services/notes'

// Patch `express.Router` to support `.ws()` without needing to pass around a `ws`-ified app.
// https://github.com/HenningM/express-ws/issues/86
// eslint-disable-next-line @typescript-eslint/no-var-requires
const patch = require('express-ws/lib/add-ws-method')
patch.default(express.Router)

const router = express.Router()

export interface NotesResponse {
  notes: Array<{
    id: string
    title: string
  }>
}

export type NoteResponse = INote

const notesHandler: RequestHandler = async (_req, res: Response<NotesResponse>) => {
  const notes = await getNotes()
  res.json({
    notes,
  } as NotesResponse)
}

const noteHandler: WebsocketRequestHandler = (ws, req) => {
  ws.on('message', async (msg: string) => {
    const noteId = req.params.id
    let note = {}
    console.log('Got message', noteId, msg)
    if (!msg) {
      note = await getNote(noteId)
      console.log('Got note', note)
    } else {
      note = await updateNote(noteId, JSON.parse(msg) as INote)
      console.log('Updated note', note)
    }
    ws.send(JSON.stringify(note))
  })
}

router.get('/', notesHandler)
router.ws('/:id', noteHandler)

export default router
