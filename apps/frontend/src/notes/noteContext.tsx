import { createContext, useState, useContext } from 'react'
import React from 'react'

interface INoteContext {
  note: any
  setNote: React.Dispatch<React.SetStateAction<any>>
}

const NoteContext = createContext<INoteContext | undefined>(undefined)

function NoteProvider({ children }: any) {
  const [note, setNote] = useState({})

  return <NoteContext.Provider value={{ note, setNote }}>{children}</NoteContext.Provider>
}

function useNoteContext() {
  const context = useContext(NoteContext)
  if (context === undefined) {
    throw new Error('useNote must be used within a NoteProvider')
  }
  return context
}

export { NoteProvider, useNoteContext }
