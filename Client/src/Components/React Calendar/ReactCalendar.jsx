import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import './reactCalendar.css'

const localizer = momentLocalizer(moment);
const ItemType = "EVENT";


export default function ReactCalendar() {

    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: "", startDate: "", end: "" });
    const [search, setSearch] = useState("");
  
    useEffect(() => {
      fetchEvents();
    }, [search]);
  
    const fetchEvents = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:4000/event-routes/events?search=${search}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
      
          if (!response.ok) {
            throw new Error("Failed to fetch events");
          }
      
          const data = await response.json();
          console.log("Fetched events:", data); // Debugging log
      
          setEvents(data.map(event => ({
            id: event._id,  // Ensure '_id' exists in backend response
            title: event.title || "Untitled Event", // Fallback title
            start: new Date(event.startDate),
            end: new Date(event.end),
            color: event.color || getRandomColor(),
          })));
        } catch (error) {
          console.error("Error fetching events", error);
        }
      };
  
    const handleAddEvent = async () => {
      try {
        const eventWithColor = { ...newEvent, color: getRandomColor() };
        const response = await fetch("http://127.0.0.1:4000/event-routes/events", {
          method: "POST",
          body: JSON.stringify(eventWithColor),
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (!response.ok) {
          throw new Error("Error adding event");
        }
        
        fetchEvents();
        setOpen(false);
      } catch (error) {
        console.error("Error adding event", error);
      }
    };
  
    const handleDeleteEvent = async (id) => {
      try {
        const response = await fetch(`http://127.0.0.1:4000/event-routes/events/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (!response.ok) {
          throw new Error("Error deleting event");
        }
        
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event", error);
      }
    };
  
    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
  
    const EventComponent = ({ event }) => {
        if (!event || !event.title || !event.id) {
          console.warn("Missing event properties", event); // Debugging
          return null; // Prevents rendering if data is missing
        }
      
        const [{ isDragging }, drag] = useDrag(() => ({
          type: ItemType,
          item: { id: event.id },
          collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
          }),
        }));
      
        return (
          <div ref={drag} style={{ backgroundColor: event.color, opacity: isDragging ? 0.5 : 1 }}>
            {event.title}
          </div>
        );
      };
  
    const TrashCan = () => {
      const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemType,
        drop: (item) => handleDeleteEvent(item.id),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      }));
  
      return (
        <div ref={drop} className="trash-can" style={{ backgroundColor: isOver ? "red" : "grey" }}>
          🗑️ Drag here to delete
        </div>
      );
    };


    return (
        <DndProvider backend={HTML5Backend}>
      <div className="calendar-container">
        <TextField
          label="Search Events"
          variant="outlined"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add Event
        </Button>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={(event) => ({ style: { backgroundColor: event.color } })}
          components={{ event: EventComponent }}
        />
        <TrashCan />
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <TextField
              type="datetime-local"
              fullWidth
              onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
            />
            <TextField
              type="datetime-local"
              fullWidth
              onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEvent} color="primary">Add</Button>
          </DialogActions>
        </Dialog>
      </div>
    </DndProvider>
  );
};