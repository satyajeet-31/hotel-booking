package com.example.hotel.service;

import com.example.hotel.model.Room;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RoomService {
    List<Room> getAllRooms();
    List<Room> getAvailableRooms(LocalDate arrival, LocalDate departure);
    Room addRoom(Room room);
    Optional<Room> getRoomById(Long id);
}