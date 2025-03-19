package com.hotelmanagementbackend.services;


import com.hotelmanagementbackend.dtos.RoleUserRequest;
import com.hotelmanagementbackend.dtos.UserRequest;
import com.hotelmanagementbackend.entities.AppRole;
import com.hotelmanagementbackend.entities.AppUser;

public interface UserService {
    AppUser addNewUser(UserRequest user);
    AppRole addNewRole(String roleName);
    void addRoleToUser(RoleUserRequest roleToUser);
    void removeRoleFromUser(RoleUserRequest roleFromUser);
    AppUser loadUserByUsername(String username);

}
