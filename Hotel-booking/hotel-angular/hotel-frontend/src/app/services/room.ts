import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Room } from '../models/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8081/api/rooms';

  constructor(private http: HttpClient) {}

  // Existing methods...
  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error loading rooms:', error);
        const errorMsg = error.error?.message || 'Failed to load rooms';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getAvailableRooms(arrival: string, departure: string): Observable<Room[]> {
    const params = new HttpParams()
      .set('arrival', arrival)
      .set('departure', departure);
    
    return this.http.get<Room[]>(`${this.apiUrl}/available`, { params }).pipe(
      catchError(error => {
        console.error('Error loading available rooms:', error);
        const errorMsg = error.error?.message || 'Failed to load available rooms';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error loading room:', error);
        const errorMsg = error.error?.message || 'Failed to load room details';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  // NEW: Add room method
  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room).pipe(
      catchError(error => {
        console.error('Error adding room:', error);
        const errorMsg = error.error?.message || 'Failed to add room';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  // NEW: Update room method (for future use)
  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room).pipe(
      catchError(error => {
        console.error('Error updating room:', error);
        const errorMsg = error.error?.message || 'Failed to update room';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  // NEW: Delete room method (for future use)
  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting room:', error);
        const errorMsg = error.error?.message || 'Failed to delete room';
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}