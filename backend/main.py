from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime
from uuid import uuid4

app = FastAPI()

class Event(BaseModel):
    id: str
    title: str
    start: datetime
    end: datetime
    all_day: bool = False

class EventCreate(BaseModel):
    title: str
    start: datetime
    end: datetime
    all_day: bool = False

events: List[Event] = []

@app.get("/events", response_model=List[Event])
def list_events():
    return events

@app.post("/events", response_model=Event)
def create_event(event_in: EventCreate):
    event = Event(
        id=str(uuid4()),
        title=event_in.title,
        start=event_in.start,
        end=event_in.end,
        all_day=event_in.all_day,
    )
    events.append(event)
    return event
