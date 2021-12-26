import React from 'react'
import { Editor } from '../editor'
import { useNote } from './hooks'
import { ReadyState } from 'react-use-websocket'
import { Paper, TextField, Badge, BadgeTypeMap } from '@mui/material'
import { useNoteContext } from './noteContext'
import { Descendant } from 'slate'

interface SingleNoteProps {
  id: string
}

const Home: React.FC<SingleNoteProps> = ({ id }) => {
  const { readyState, sendMessage } = useNote(id)
  const { note, setNote } = useNoteContext()

  const connectionStatusColor = {
    [ReadyState.CONNECTING]: 'info',
    [ReadyState.OPEN]: 'success',
    [ReadyState.CLOSING]: 'warning',
    [ReadyState.CLOSED]: 'error',
    [ReadyState.UNINSTANTIATED]: 'error',
  }[readyState] as BadgeTypeMap['props']['color']

  const updateNote = (newNote: Descendant[]) => {
    // setNote(newNote)
    sendMessage(JSON.stringify(newNote))
  }

  return note ? (
    <>
      <Badge color={connectionStatusColor} variant="dot" sx={{ width: '100%' }}>
        <TextField
          value={note.title}
          onChange={(e) => {
            const newNote = { ...note, title: e.target.value }
            setNote(newNote)
            updateNote(newNote)
          }}
          variant="standard"
          fullWidth={true}
          inputProps={{ style: { fontSize: 32, color: '#666' } }}
          sx={{ mb: 2 }}
        />
      </Badge>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Editor onNoteChange={updateNote} />
      </Paper>
    </>
  ) : null
}

export default Home
