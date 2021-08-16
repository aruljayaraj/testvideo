export interface DropDown {
    value: number|string;
    label: string;
    pid?: number|string;
}

export interface SearchProps{
    b2b?: string,
    b2c?: string,
    br?: string,
    d?: string,
    bn?: string,
    keyword?: string,
    display?: string,
    type?: string
  }