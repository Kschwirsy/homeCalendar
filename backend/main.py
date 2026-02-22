from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime
from uuid import uuid4

app = FastAPI()

class Event(BaseModel):
    id: str | None = None
    title: str
    start: datetime
    end: datetime
    all_day: bool = False

events: List[Event] = []

@app.get("/events", response_model=List[Event])
def list_events():
    return events

@app.post("/events", response_model=Event)
def create_event(event: Event):
    if event.id is None:
        event.id = str(uuid4())
    events.append(event)
    return event
