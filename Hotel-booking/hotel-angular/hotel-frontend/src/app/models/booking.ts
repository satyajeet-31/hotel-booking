import { Room } from "./room";
import { User } from "./user";

export interface Booking {
  id?: number;
  user: User;
  room: Room;
  arrivalDate: string;
  departureDate: string;
}