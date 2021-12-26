import { Descendant } from 'slate'
import automerge from 'automerge'
import db from '../firebase'

const NOTES_COLLECTION = 'notes'
const notesRef = db.collection(NOTES_COLLECTION)

export interface INote {
  id: string
  title: string
  content: Array<Descendant>
}

export async function getNote(id: string): Promise<INote> {
  const noteRef = notesRef.doc(id)
  const noteDoc = await noteRef.get()
  return noteDoc.data() as INote
}

export async function getNotes(): Promise<INote[]> {
  const notes: INote[] = []
  const notesSnapshot = await notesRef.get()
  notesSnapshot.forEach((doc) => {
    notes.push(doc.data() as INote)
  })
  return notes
}

export async function updateNote(id: string, note: INote): Promise<any> {
  let newNote = automerge.from(note)

  const currentNote = await notesRef.doc(id).get()
  const currentNoteDoc = automerge.from(currentNote.data() as INote)

  newNote = automerge.merge(currentNoteDoc, newNote)

  await notesRef.doc(id).set(newNote, { merge: true })

  return newNote
}
