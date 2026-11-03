export enum CRUD {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LINK = 'link',
  DUPLICATE = 'duplicate'
}

export enum ColumnType {
  ICON = 'icon',
  TEXT = 'text',
  DATE = 'date',
  DATE_TIME = 'date-time',
  NUMBER = 'number',
  Filter = 'filter',
  ICON_AND_TEXT = 'icon-and-text',
  PASSWORD = 'password',
  BUTTON = 'button',
  DROPDOWNLIST = 'dropdownlist',
  IMAGE = 'image'
}

export enum ColumnSize {
  XSmall = 'x-small-column',
  Small = 'small-column',
  Medium = 'medium-column',
  Large = 'large-column',
  XLarge = 'x-large-column'
}


export enum InputType {
  Dropdown = 'ddl',
  MultiSelect = 'multiselect',
  Text = 'text',
  Number = 'number',
  Date = 'date',
  TextArea = 'textarea',
  Checkbox = 'checkbox'
}


export enum ScreenSize {
  lg = 1281,   // High Resolution desktops min-width:1281px
  md = 1025,   // Laptop and desktops min-width:1025px
  sml = 801, // Landscape Tablet and iPads	min-width:801px
  sm = 600,  // Portrait Tablet and iPads	min-width:600px
  xsl = 480,  // Phone with Landscape mode	min-width:480px
  sx = 320,  // Phone with portrait mode	min-width:320px
}
