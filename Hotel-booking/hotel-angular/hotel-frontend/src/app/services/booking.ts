import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8081/api/bookings'; // ← Changed to 8081

  constructor(private http: HttpClient) {}

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking).pipe(
      catchError(error => {
        const errorMsg = error.error?.message || error.error || 'Booking failed';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getUserBookings(userId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(error => {
        console.error('Error loading user bookings:', error);
        const errorMsg = error.error?.message || 'Failed to load your bookings';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error loading all bookings:', error);
        const errorMsg = error.error?.message || 'Failed to load bookings';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  checkRoomAvailability(roomId: number, arrival: string, departure: string): Observable<boolean> {
    const params = new HttpParams()
      .set('roomId', roomId.toString())
      .set('arrival', arrival)
      .set('departure', departure);
    
    return this.http.get<boolean>(`${this.apiUrl}/availability`, { params }).pipe(
      catchError(error => {
        console.error('Error checking availability:', error);
        const errorMsg = error.error?.message || 'Failed to check room availability';
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}