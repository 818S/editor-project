/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect } from 'react'
import useSWR from 'swr'
import { NotesResponse, NoteResponse } from '../../../backend/routes/notes'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useNoteContext } from './noteContext'
import equal from 'fast-deep-equal'

// If you want to use GraphQL API or libs like Axios, you can create your own fetcher function.
// Check here for more examples: https://swr.vercel.app/docs/data-fetching
const fetcher = async (input: RequestInfo, init: RequestInit) => {
  const res = await fetch(input, init)
  return res.json()
}

export const useNotesList = () => {
  const { data, error } = useSWR<NotesResponse>('http://localhost:3001/api/notes', fetcher)

  return {
    notesList: data?.notes,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useNote = (id: string) => {
  const { note, setNote } = useNoteContext()
  const { readyState, lastMessage, sendMessage } = useWebSocket(`ws://localhost:3001/api/notes/${id}`)

  // Send a message when ready on first load
  useEffect(() => {
    if (readyState === ReadyState.OPEN && lastMessage === null) {
      sendMessage('')
    }

    if (lastMessage?.data) {
      const newNote = JSON.parse(lastMessage.data)
      // TODO: better diff and updating
      if (!equal(note, newNote)) {
        console.log('Updating local note with remote: ')
        console.log(note, newNote)
        setNote(newNote)
      }
    }
  }, [readyState, lastMessage])

  return {
    // note: lastMessage && (JSON.parse(lastMessage.data) as NoteResponse),
    readyState,
    sendMessage
  }
}
