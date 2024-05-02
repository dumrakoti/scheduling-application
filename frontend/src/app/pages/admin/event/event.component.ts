import { Component, ChangeDetectorRef, OnDestroy, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import timezones from 'timezones-list';
import { SchedulingService } from 'src/app/core/services/scheduling.service';
import { Holiday } from 'src/app/core/model/Holiday';
import { Country } from 'src/app/core/model/Country';
import { Timezone } from 'src/app/core/model/Timezone';
import { MatDialog } from '@angular/material/dialog';

import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CreateEventComponent } from '../shared/create-event/create-event.component';
import { DeleteEventComponent } from '../shared/delete-event/delete-event.component';
import { Event } from 'src/app/core/model/Event';
import { find, map } from 'lodash';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit, OnDestroy {
  private schedulingService = inject(SchedulingService);
  private changeDetector = inject(ChangeDetectorRef)
  private dialog = inject(MatDialog);
  private title = inject(Title);

  defaultCountry: string = 'US';
  defaultTimezone: string = 'UTC';
  defaultYear: number = new Date().getFullYear();

  eventsSubscrption: Subscription | any;
  eventsData: Event[] = [];
  eventsLoader: boolean = false;

  holidaysSubscrption: Subscription | any;
  holidaysData: Holiday[] = [];
  holidaysLoader: boolean = false;

  countrySubscrption: Subscription | any;
  countryData: Country[] = [];

  timezonesData: Timezone[] = [];

  calendarVisible: boolean = false;
  calendarOptions: CalendarOptions | any = {
    timeZone: this.defaultTimezone,
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: [], // alternatively, use the `events` setting to fetch from a feed
    events: [],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];

  ngOnInit(): void {
    this.title.setTitle('Events | Calendar Scheduling');
    this.timezonesData = timezones || [];
    this.fetchEvents();
    this.fetchCountries();
  }

  fetchEvents(): void {
    if (this.eventsSubscrption) { this.eventsSubscrption.unsubscribe(); }
    this.eventsData = [];
    this.eventsLoader = true;
    this.eventsSubscrption = this.schedulingService.getEvents().subscribe({
      next: (response: any) => {
        this.eventsData = response && response.data || [];
        // const el: EventInput[] = [];
        // map(this.eventsData, (ed: any) => {
        //   this.calendarOptions?.events.push({ id: ed._id, start: ed.start, end: ed.end, title: ed.title });
        // });
        // this.calendarOptions?.events = { ...this.calendarOptions.events, el};
        // this.changeDetector.detectChanges();
        this.eventsLoader = false;
        this.fetchHolidays();
      }, error: (error) => {
        this.eventsData = [];
        this.eventsLoader = false;
        this.fetchHolidays();
      }
    });
  }

  fetchCountries(): void {
    if (this.countrySubscrption) { this.countrySubscrption.unsubscribe(); }
    this.countryData = [];
    this.countrySubscrption = this.schedulingService.getCountries().subscribe({
      next: (response: any) => {
        this.countryData = response && response.data || [];
      }, error: (error) => {
        this.countryData = [];
      }
    });
  }

  fetchHolidays(): void {
    if (this.holidaysSubscrption) { this.holidaysSubscrption.unsubscribe(); }
    this.holidaysData = [];
    this.holidaysLoader = true;
    this.holidaysSubscrption = this.schedulingService.getHolidays(this.defaultCountry, this.defaultYear).subscribe({
      next: (response: any) => {
        this.holidaysData = response && response.data || [];
        // map(this.holidaysData, (holiday: any) => {
        //   this.calendarOptions?.events.push({ id: holiday.uuid, start: holiday.date, end: holiday.date, title: holiday.name });
        // });
        this.updateCalenderOptions();
        this.holidaysLoader = false;
        this.calendarVisible = true;
      }, error: (error) => {
        this.holidaysData = [];
        this.calendarVisible = true;
        this.holidaysLoader = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.holidaysSubscrption) { this.holidaysSubscrption.unsubscribe(); }
    if (this.countrySubscrption) { this.countrySubscrption.unsubscribe(); }
  }

  updateCalenderOptions() {
    this.calendarOptions.events = [];
    if (this.eventsData && this.eventsData.length > 0) {
      map(this.eventsData, (ed: any) => {
        this.calendarOptions?.events.push({ id: ed._id, start: ed.start, end: ed.end, title: ed.title, description: ed.description, participants: ed.participants });
      });
    }

    if (this.holidaysData && this.holidaysData.length > 0) {
      map(this.holidaysData, (holiday: any) => {
        this.calendarOptions?.events.push({ id: holiday.uuid, start: holiday.date, end: holiday.date, title: holiday.name, description: '', participants: '' });
      });
    }
  }

  onChangeTimezone(el: any): void {
    this.calendarVisible = false;
    setTimeout(() => {
      console.log('el', el);
      this.calendarOptions.timeZone = el;
      this.changeDetector.detectChanges();
      this.calendarVisible = true;
      this.fetchEvents();
    }, 1000);
  }

  onChangeCountry(ev: any): void {
    if (ev === null) { ev = '' };
    this.calendarVisible = false;
    this.fetchEvents();
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const creRef = this.dialog.open(CreateEventComponent, {
      width: '42%',
      autoFocus: false,
      disableClose: true,
      panelClass: 'event-dialog',
      data: { selectInfo }
    });

    creRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result) {
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect(); // clear date selection
        calendarApi.addEvent(result);
        this.fetchEvents();
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event.id);
    const id = clickInfo.event.id;
    const eventObj = find(this.calendarOptions.events, ['id', id]);
    console.log('eventObj', eventObj);

    const delRef = this.dialog.open(DeleteEventComponent, {
      width: '42%',
      autoFocus: false,
      disableClose: true,
      panelClass: 'event-dialog',
      data: { clickInfo, id, eventObj }
    });

    delRef.afterClosed().subscribe((result: any) => {
      if (result) { this.calendarVisible = false; this.fetchEvents(); clickInfo.event.remove(); }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }


}
