export class Country {
  code: string;
  name: string;
  flag: string;
  codes: any;
  languages: any;
  currencies: ICurrencies[] | undefined;
  subdivisions: ISubdivisions[] | undefined;
  weekend: IWeekend[] | undefined;

  constructor(code: string, name: string, flag: string) {
    this.code = code;
    this.name = name;
    this.flag = flag;
  }
}

export class ICurrencies {
  alpha: string;

  constructor(alpha: string) {
    this.alpha = alpha;
  }
}

export class ISubdivisions {
  code: string;
  name: string;
  languages: any;

  constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }
}

export class IWeekend {
  numeric: string;
  name: string;

  constructor(numeric: string, name: string) {
    this.numeric = numeric;
    this.name = name;
  }
}
