package com.example.hotel.service;

import com.example.hotel.model.Booking;
import java.util.List;

public interface BookingService {
    Booking createBooking(Booking booking);
    List<Booking> getUserBookings(Long userId);
    List<Booking> getAllBookings();
    boolean isRoomAvailable(Long roomId, String arrival, String departure);
}