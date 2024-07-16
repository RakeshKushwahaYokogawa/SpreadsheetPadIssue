export interface IInventory {
  inventoryItemId: string;
  reserveId: number;
  subject: string;
  name: string;
  startTime: string;
  endTime: string;
  startTimeZone: string;
  endTimeZone: string;
  isAllDay: boolean;
  location: string;
  description: string;
  recurrenceId: string;
  recurrenceException: string;
  recurrenceRule: string;
  updatedBy: string;
  updatedOn: string;
  createdBy: string;
  createdOn: string;
  installationLocation: string;
}


export interface IReagentDetails {
  inventoryItemId: string;
  reserveId: number;
  createdBy: string;
  createdOn: string;
  startTime: string;
  endTime: string;
  comment: string;
  location?: string;
  quantity?: string;
  name?: string;
  reserveOn?: string;
}