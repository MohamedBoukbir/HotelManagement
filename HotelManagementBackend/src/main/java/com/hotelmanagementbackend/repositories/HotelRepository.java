package com.hotelmanagementbackend.repositories;

import com.hotelmanagementbackend.entities.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository  extends JpaRepository<Hotel, Long> {
}
