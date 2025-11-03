package com.example.hotel.repository;

import com.example.hotel.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.arrivalDate < :departure AND b.departureDate > :arrival")
    List<Booking> findOverlappingBookings(@Param("roomId") Long roomId, 
                                         @Param("arrival") LocalDate arrival, 
                                         @Param("departure") LocalDate departure);
}