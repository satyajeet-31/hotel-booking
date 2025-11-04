import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RoomService } from '../../services/room';
import { Room } from '../../models/room';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './room-list.html',
  styleUrls: ['./room-list.css']
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  availableRooms: Room[] = [];
  showAvailable = false;
  arrivalDate = '';
  departureDate = '';
  isLoading = false;
  errorMessage = '';

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadAllRooms();
  }

  loadAllRooms(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  searchAvailableRooms(): void {
    if (this.arrivalDate && this.departureDate) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.roomService.getAvailableRooms(this.arrivalDate, this.departureDate).subscribe({
        next: (rooms) => {
          this.availableRooms = rooms;
          this.showAvailable = true;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Please select both arrival and departure dates';
    }
  }

  showAllRooms(): void {
    this.showAvailable = false;
    this.errorMessage = '';
  }
}