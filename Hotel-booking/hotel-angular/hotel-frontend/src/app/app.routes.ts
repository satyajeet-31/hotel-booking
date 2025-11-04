import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { RoomListComponent } from './components/room-list/room-list';
import { BookingComponent } from './components/booking/booking';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { AdminGuard } from './guards/admin-guard';
import { AdminAddRoomComponent } from './components/admin-add-room/admin-add-room';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'book-room/:id', component: BookingComponent },
  { path: 'my-bookings', component: UserDashboardComponent },
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent,
    canActivate: [AdminGuard] // Protect admin route
  },
  { 
    path: 'admin/add-room', 
    component: AdminAddRoomComponent,
    canActivate: [AdminGuard]
  },
  { path: '**', redirectTo: '/login' }
];