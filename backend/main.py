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
    person: str | None = None

class EventCreate(BaseModel):
    title: str
    start: datetime
    end: datetime
    all_day: bool = False
    person: str | None = None

class Chore(BaseModel):
  id: str
  person: str
  text: str
  done: bool = False

class ChoreCreate(BaseModel):
  person: str
  text: str

events: List[Event] = []
chores: List[Chore] = []

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
        person=event_in.person,
    )
    events.append(event)
    return event


@app.post("/chores/{chore_id}/toggle", response_model=Chore)
def toggle_chore(chore_id: str):
    for chore in chores:
        if chore.id == chore_id:
            chore.done = not chore.done
            return chore
    raise HTTPException(status_code=404, detail="Chore not found")


@app.get("/chores", response_model=List[Chore])
def list_chores():
  return chores

@app.post("/chores", response_model=Chore)
def create_chore(chore_in: ChoreCreate):
  chore = Chore(
      id=str(uuid4()),
      person=chore_in.person,
      text=chore_in.text,
      done=False,
  )
  chores.append(chore)
  return chore
