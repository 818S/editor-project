import React from 'react'
import { Add } from '@mui/icons-material'
import { Toolbar, Typography, Drawer, Divider, Box, Container, Fab } from '@mui/material'
import { NotesList } from '../notes'
import { NoteProvider } from '../notes/noteContext'

const drawerWidth = 240

interface InterfaceProps {
  activeNoteId?: string
}

const Interface: React.FC<InterfaceProps> = ({ activeNoteId, children }) => {
  return (
    <NoteProvider>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Notes
            </Typography>
          </Toolbar>
          <Divider />
          <NotesList activeNoteId={activeNoteId} />
          <Divider />
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            backgroundColor: '#eee',
            overflow: 'auto',
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
            {/* TODO: Implement new note button */}
            <Fab
              onClick={() => console.log('clicked')}
              color="primary"
              sx={{
                position: 'fixed',
                bottom: 30,
                right: 30,
              }}
            >
              <Add />
            </Fab>
          </Container>
        </Box>
      </Box>
    </NoteProvider>
  )
}

export default Interface
