package com.hotelmanagementbackend.repositories;


import com.hotelmanagementbackend.entities.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppRoleRepository  extends JpaRepository<AppRole, String> {

}
