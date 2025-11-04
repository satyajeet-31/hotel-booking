import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking';
import { AuthService } from '../../services/auth';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  allBookings: Booking[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  totalRevenue: number = 0;
  totalBookings: number = 0;
  activeBookings: number = 0;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('Admin Dashboard initialized');
    this.loadAllBookings();
  }

  loadAllBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Loading all bookings...');

    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        console.log('Bookings loaded successfully:', bookings);
        this.allBookings = bookings;
        this.calculateStatistics();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading all bookings:', error);
        this.errorMessage = 'Failed to load bookings. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        console.log('Bookings loading completed');
      }
    });
  }

  calculateStatistics(): void {
    this.totalBookings = this.allBookings.length;
    this.totalRevenue = this.allBookings.reduce((total, booking) => {
      return total + this.calculateTotal(booking);
    }, 0);
    
    this.activeBookings = this.allBookings.filter(booking => 
      this.getBookingStatus(booking) === 'Active'
    ).length;

    console.log('Statistics calculated:', {
      totalBookings: this.totalBookings,
      totalRevenue: this.totalRevenue,
      activeBookings: this.activeBookings
    });
  }

  calculateTotal(booking: Booking): number {
    try {
      const arrival = new Date(booking.arrivalDate);
      const departure = new Date(booking.departureDate);
      const nights = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
      const total = nights * booking.room.pricePerNight;
      return Math.max(total, booking.room.pricePerNight);
    } catch (error) {
      console.error('Error calculating total for booking:', booking, error);
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
      console.error('Error calculating nights for booking:', booking, error);
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
      console.error('Error getting booking status:', booking, error);
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
      console.error('Error formatting date:', dateString, error);
      return dateString;
    }
  }

  getUserDisplayName(booking: Booking): string {
    const displayName = booking.user?.fullName || booking.user?.username || 'Unknown User';
    console.log('User display name for booking:', booking.id, displayName);
    return displayName;
  }
}