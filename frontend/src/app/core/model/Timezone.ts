export class Timezone {
  label: string;
  name: string;
  tzCode: string;
  utc: string;

  constructor(label: string, name: string, tzCode: string, utc: string) {
    this.label = label;
    this.name = name;
    this.tzCode = tzCode;
    this.utc = utc;
  }
}
