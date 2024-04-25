export class Event {
  title: string;
  start: string;
  end: string;
  description: string;
  participants: string;

  constructor(title: string, start: string, end: string, description: string, participants: string) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.description = description;
    this.participants = participants;
  }
}
