import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking';
import { RoomService } from '../../services/room';
import { AuthService } from '../../services/auth';
import { Booking } from '../../models/booking';
import { Room } from '../../models/room';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent implements OnInit {
  booking: Booking = {} as Booking;
  roomId!: number;
  room!: Room;
  minDate: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private roomService: RoomService,
    private authService: AuthService
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.roomId = +this.route.snapshot.paramMap.get('id')!;
    this.initializeBooking();
    this.loadRoom();
  }

  initializeBooking(): void {
    const currentUser = this.authService.getCurrentUser();
    this.booking = {
      user: currentUser,
      room: {} as Room,
      arrivalDate: '',
      departureDate: ''
    };
  }

  loadRoom(): void {
    this.roomService.getRoomById(this.roomId).subscribe({
      next: (room) => {
        this.room = room;
        this.booking.room = room;
      },
      error: (error) => console.error('Error loading room:', error)
    });
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      alert('Please fill all required fields');
      return;
    }

    this.bookingService.createBooking(this.booking).subscribe({
      next: (response) => {
        alert('Booking successful!');
        this.router.navigate(['/my-bookings']);
      },
      error: (error) => {
        alert('Booking failed: ' + (error.error || 'Unknown error'));
      }
    });
  }

  checkAvailability(): void {
    if (this.booking.arrivalDate && this.booking.departureDate) {
      this.bookingService.checkRoomAvailability(
        this.roomId,
        this.booking.arrivalDate,
        this.booking.departureDate
      ).subscribe({
        next: (isAvailable) => {
          if (!isAvailable) {
            alert('Room is not available for selected dates');
          } else {
            alert('Room is available!');
          }
        },
        error: (error) => {
          alert('Error checking availability');
        }
      });
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.booking.arrivalDate &&
      this.booking.departureDate &&
      this.booking.user &&
      this.booking.room
    );
  }
}