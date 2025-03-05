"use client"
import { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridView from '@fullcalendar/daygrid'
import timeGridView from '@fullcalendar/timegrid'
import interactionPlugin, {Draggable} from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import './calendar.css'
import modalPlugin from '@fullcalendar/interaction'
import { Button, createTheme, ThemeProvider } from '@mui/material'
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import AlertMessage from '../AlertMessage/AlertMessage'





export default function Calender() {


    const [events, setEvents] = useState([])
    const [allEvents, setAllevents] = useState([])
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [alert, setAlert] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isRemoveMode, setIsRemoveMode] = useState(false) // State to track "remove mode"
    
    const calendarRef = useRef(null) // Reference for FullCalendar

    async function postData (arg){


      const URL = 'http://127.0.0.1:4000/events/create'
      const title = arg.event.title
      const startDate = arg.event.startStr
      const description = arg.event.description
      const token = localStorage.getItem('token')

      const evnt = {
        title: title,
        startDate: startDate,
        description: description
      }
    
      try{

        const res = await fetch(URL,{
          method: 'Post',
          headers: {'Content-Type': 'application/json',
                    'Authorization': `${token}`
          },
          body: JSON.stringify(evnt)
        })

        if(!res.ok){
          if(res.status === 404){
            throw new Error(res.statusText)
          }
        }

        const info = await res.json()
        
        setData(info)

      }catch(err){
        console.log(err.message)
        setError(error)
      }
    }

    useEffect(() => {
      
      let dropItem = document.getElementById('draggable-el')
      
      if(dropItem){
        new Draggable(dropItem,{
          itemSelector: 'div',
          eventData: function(eventEl){
            let title = eventEl.getAttribute('title')
            let id = eventEl.getAttribute('data')
            let description = eventEl.getAttribute('description')
            let backgroundColor = eventEl.getAttribute('backgroundColor')
            return{title, id,description,backgroundColor}
          }
        })
      }

    },[])

    function addEvent (data) {
      const event = {
        title: data.draggedEl.innerText,
        start: data.date.toISOString(),
        allDay: data.allDay,
        id: new Date().getTime().toString(),
        description: data.description,
        backgroundColor: data.backgroundColor
      }
      setAllevents([...allEvents, event])
      console.log(event)
    }

    function handelAddEventInput(){

      let addedEvent = document.getElementById('inputs').value
      if(addedEvent === ''){
        setAlert({message: 'You didnt add a name', type: "error"})
        return
      }
      let el = document.getElementById('draggable-el')
      console.log(el)
      document.getElementById('inputs').value = ''
      const newId = new Date().getTime().toString()
      setEvents([...events, {title: addedEvent,id: newId, description: ''}])
      setAllevents([...allEvents, {title: addedEvent, start: '',id: newId,description: ''}])
      
    }

    function handleKeyDown(event) {
      if (event.key === 'Enter') {
        handleAddEventInput()
      }
    }

    function toggleRemoveMode() {
      setIsRemoveMode(!isRemoveMode) // Toggle remove mode on/off
    }
    
    function handleEventClick(info) {
      if (isRemoveMode) {
        if (window.confirm(`Are you sure you want to delete the event: "${info.event.title}"?`)) {
          info.event.remove() // Remove the clicked event
          console.log(`Event with ID ${info.event.id} removed.`)
        }
        setIsRemoveMode(false) // Turn off remove mode after deletion
      } else {
        console.log(`Clicked on event: ${info.event.title}`)
      }
    }

    const handleClicking = (info) => {
      setAlert({message: `You've selected ${info.event._def.title}`, type: "success"})
      const editedEventId = info.event._def.publicId
      const editedEventTitle = window.prompt('Enter the new data for the event')
      
      if(editedEventTitle === null){
        return
      }
      const newDesc = window.prompt('Add a note to the event')
      const updatedEvents = allEvents.map((event) => {
        if (event.id === editedEventId) {
          return { ...event, title: editedEventTitle, 
                              description: newDesc
          }
        }
        return event
      })
  
      setAllevents(updatedEvents)
      setSelectedEvent(info.event)
      setShowModal(true)
    }

    function closeModal(){
      setShowModal(false)
      setSelectedEvent(null)
    }

    const changeEventColor = () => {
        
        
      const updatedEvent = allEvents.map((evnt) => {
        if(evnt.id === selectedEvent.id){
          console.log(evnt)
        }
        return evnt
      })
      setAllevents(updatedEvent)
      console.log(updatedEvent)
      if(!selectedEvent){
        console.log('please select an event')
        return
      }
    }

    const theme = createTheme({
      palette:{
        primary:{
          main: '#1a1f3d'
        }
      }
    })
    
  return (
    <>
      <div className='container'>
      <div className='left-side'>
      {alert.message && <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ message:"", type: ""})} />}


    <div id='draggable-el'>
          <h1>Students</h1>
  
          {events.map((ev,i) => (
            <div 
              title= {ev.title}
              key={i}
              id='drag-evnt'
              onClick={()=> handleClicking(ev)}
            >
              {ev.title}
            </div>
          ))}
        </div>
          <div id='addEventFld'>

          <h1>Add Student Name</h1>
          <ThemeProvider theme={theme}>

          <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1 } }}
          noValidate
          autoComplete="off"
          >
        
        

          <Input placeholder='Add name here' id='inputs' type='text' onKeyDown={handleKeyDown}/>
          </Box>
          <Button variant='contained' onClick={handelAddEventInput} color='primary'>Add</Button>
          <Button variant='contained' onClick={toggleRemoveMode} style={{backgroundColor: isRemoveMode ? 'red' : '' }}
          >{isRemoveMode ? 'Cancel Remove Mode' : 'Remove'}</Button>

          </ThemeProvider>
          </div>

          <ThemeProvider theme={theme}>

          <div id='showingEvent'>
          <h2>Student</h2>
          {showModal && selectedEvent && (
            <div className='modal'>
              <h3>Students Details</h3>
              <p>Name: {selectedEvent.title}</p>
              <p>Description: {selectedEvent.description}</p>
              <input type="text" placeholder='Description...' id='desc-input' />
              <Button variant="contained" onClick={handleClicking}>Add</Button>
              <Button variant='contained' onClick={closeModal}>Close</Button>
            </div>

          )}
          </div>
          </ThemeProvider>
      </div>

      <div className='right-side'>

    <h2 id='cal-title'>Teacher Schedule</h2>
    <div className='full-cal'>

      <FullCalendar
        
        plugins={[dayGridView,timeGridView,interactionPlugin,listPlugin, modalPlugin]}
        headerToolbar={{
            center: 'title',
            left: 'dayGridMonth,timeGridWeek,dayGridDay,listWeek'
        }}
        nowIndicator={true}
        droppable = {true}
        selectable = {true}
        editable = {true}
        listDaySideFormat
        drop={(info) => {
          addEvent(info)
        }}
        eventClick={(info) => {
        handleClicking(info)
        handleEventClick(info)
        //postData(info)
        }}
        dayMaxEventRows={true}
        events={allEvents}
        eventBackgroundColor={'#378006'}
      />
    </div>
      </div>
      </div>
      
    </>
  )
}