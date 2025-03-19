package com.hotelmanagementbackend.repositories;



import com.hotelmanagementbackend.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, String> {
  AppUser findByUsername(String username);
}
