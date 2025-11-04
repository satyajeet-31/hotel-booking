import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RoomService } from '../../services/room';
import { Room } from '../../models/room';

@Component({
  selector: 'app-admin-add-room',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-add-room.html',
  styleUrls: ['./admin-add-room.css']
})
export class AdminAddRoomComponent {
  room: Room = {
    roomNumber: '',
    roomType: '',
    pricePerNight: 0
  };
  
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  roomTypes: string[] = [
    'Single',
    'Double', 
    'Suite',
    'Deluxe',
    'Executive',
    'Presidential'
  ];

  constructor(
    private roomService: RoomService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Validate form
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.roomService.addRoom(this.room).subscribe({
      next: (savedRoom) => {
        this.isLoading = false;
        this.successMessage = `Room ${savedRoom.roomNumber} added successfully!`;
        
        // Reset form
        this.room = {
          roomNumber: '',
          roomType: '',
          pricePerNight: 0
        };

        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to add room. Please try again.';
        console.error('Error adding room:', error);
      }
    });
  }

  private isFormValid(): boolean {
    return !!(
      this.room.roomNumber && 
      this.room.roomType && 
      this.room.pricePerNight > 0
    );
  }

  onCancel(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}