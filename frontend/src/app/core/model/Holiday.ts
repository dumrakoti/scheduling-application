export class Holiday {
  name: string;
  date: string;
  observed: string;
  uuid: string;
  country: string;
  public: any;
  weekday: any | undefined;

  constructor(country: string, date: string, name: string, observed: string, uuid: string) {
    this.date = date;
    this.name = name;
    this.observed = observed;
    this.uuid = uuid;
    this.country = country;
  }
}
