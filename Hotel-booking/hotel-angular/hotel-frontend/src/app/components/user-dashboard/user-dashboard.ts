import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking';
import { AuthService } from '../../services/auth';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent implements OnInit {
  bookings: Booking[] = [];
  currentUser: any;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUserBookings();
  }

  loadUserBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.currentUser && this.currentUser.id) {
      this.bookingService.getUserBookings(this.currentUser.id).subscribe({
        next: (bookings) => {
          this.bookings = bookings;
          this.isLoading = false;
          console.log('Bookings loaded:', bookings);
        },
        error: (error) => {
          this.errorMessage = 'Failed to load your bookings. Please try again.';
          this.isLoading = false;
          console.error('Error loading bookings:', error);
        }
      });
    } else {
      this.errorMessage = 'User not found. Please login again.';
      this.isLoading = false;
    }
  }

  calculateTotal(booking: Booking): number {
    try {
      const arrival = new Date(booking.arrivalDate);
      const departure = new Date(booking.departureDate);
      const nights = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
      const total = nights * booking.room.pricePerNight;
      return Math.max(total, booking.room.pricePerNight);
    } catch (error) {
      return booking.room.pricePerNight;
    }
  }

  calculateNights(booking: Booking): number {
    try {
      const arrival = new Date(booking.arrivalDate);
      const departure = new Date(booking.departureDate);
      const nights = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(nights, 1);
    } catch (error) {
      return 1;
    }
  }

  getBookingStatus(booking: Booking): string {
    try {
      const today = new Date();
      const arrival = new Date(booking.arrivalDate);
      const departure = new Date(booking.departureDate);
      
      today.setHours(0, 0, 0, 0);
      arrival.setHours(0, 0, 0, 0);
      departure.setHours(0, 0, 0, 0);
      
      if (today < arrival) {
        return 'Upcoming';
      } else if (today >= arrival && today <= departure) {
        return 'Active';
      } else {
        return 'Completed';
      }
    } catch (error) {
      return 'Unknown';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'Upcoming': return 'bg-warning text-dark';
      case 'Active': return 'bg-success text-white';
      case 'Completed': return 'bg-secondary text-white';
      default: return 'bg-info text-white';
    }
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  getTotalBookingsCount(): number {
    return this.bookings.length;
  }

  getUpcomingBookingsCount(): number {
    return this.bookings.filter(b => this.getBookingStatus(b) === 'Upcoming').length;
  }

  getActiveBookingsCount(): number {
    return this.bookings.filter(b => this.getBookingStatus(b) === 'Active').length;
  }

  getTotalAmountSpent(): number {
    return this.bookings.reduce((total, booking) => total + this.calculateTotal(booking), 0);
  }
}