package com.example.hotel.service.impl;

import com.example.hotel.model.Booking;
import com.example.hotel.repository.BookingRepository;
import com.example.hotel.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomServiceImpl roomService;

    @Override
    public Booking createBooking(Booking booking) {
        // Check room availability before booking
        boolean isAvailable = isRoomAvailable(
            booking.getRoom().getId(),
            booking.getArrivalDate().toString(),
            booking.getDepartureDate().toString()
        );
        
        if (!isAvailable) {
            throw new RuntimeException("Room is not available for the selected dates");
        }
        
        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public boolean isRoomAvailable(Long roomId, String arrival, String departure) {
        LocalDate arrivalDate = LocalDate.parse(arrival);
        LocalDate departureDate = LocalDate.parse(departure);
        
        List<?> overlappingBookings = bookingRepository.findOverlappingBookings(
            roomId, arrivalDate, departureDate);
        
        return overlappingBookings.isEmpty();
    }

	public RoomServiceImpl getRoomService() {
		return roomService;
	}

	public void setRoomService(RoomServiceImpl roomService) {
		this.roomService = roomService;
	}
}