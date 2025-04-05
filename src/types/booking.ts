export interface BookingData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateTime: string;
  turnTime: TurnTime;
  numberPersons: string;
  comments: string;
}

export interface TableData {
  tableName?: string;
  tableId: string;
  SeatNumber: number;
}

export interface BookingResponse {
  status: string;
  data: BookingData;
  table: TableData[] | null;
  message: string | null;
}

export enum TurnTime {
  Morning = "morning",
  Afternoon = "afternoon",
  Evening = "evening",
}
export interface BookingForm {
  profileInfo: {
    step: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    completed: boolean;
  };
  bookingDate: {
    step: number;
    dateTime: string;
    turnTime: TurnTime;
    completed: boolean;
  };
  bookingInfo: {
    step: number;
    numberPersons: string;
    comments: string;
    completed: boolean;
  };
}

export interface BookingFormData {
  response?: BookingResponse | null;
  form?: BookingForm;
  loading: boolean;
  success: string | null;
}
