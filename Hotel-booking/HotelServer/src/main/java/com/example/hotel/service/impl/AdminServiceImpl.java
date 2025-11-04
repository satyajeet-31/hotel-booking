package com.example.hotel.service.impl;

import com.example.hotel.model.Admin;
import com.example.hotel.repository.AdminRepository;
import com.example.hotel.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public Admin registerAdmin(Admin admin) {
        // Check if admin username already exists
        if (adminRepository.findByUsername(admin.getUsername()).isPresent()) {
            throw new RuntimeException("Admin username already exists");
        }
        return adminRepository.save(admin);
    }

    @Override
    public Optional<Admin> loginAdmin(String username, String password) {
        return adminRepository.findByUsernameAndPassword(username, password);
    }
}