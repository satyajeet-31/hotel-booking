package com.example.hotel.service.impl;

import com.example.hotel.model.Room;
import com.example.hotel.repository.BookingRepository;
import com.example.hotel.repository.RoomRepository;
import com.example.hotel.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public List<Room> getAvailableRooms(LocalDate arrival, LocalDate departure) {
        List<Room> allRooms = roomRepository.findAll();
        
        return allRooms.stream()
                .filter(room -> {
                    List<?> overlappingBookings = bookingRepository.findOverlappingBookings(
                            room.getId(), arrival, departure);
                    return overlappingBookings.isEmpty();
                })
                .collect(Collectors.toList());
    }

    @Override
    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    @Override
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }
}