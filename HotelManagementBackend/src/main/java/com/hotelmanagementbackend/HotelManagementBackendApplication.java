package com.hotelmanagementbackend;

import com.hotelmanagementbackend.dtos.RoleUserRequest;
import com.hotelmanagementbackend.dtos.UserRequest;
import com.hotelmanagementbackend.services.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class HotelManagementBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelManagementBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunnerUserDetails(UserService userService){
        return args -> {
            userService.addNewRole("USER");
            userService.addNewRole("ADMIN");

            userService.addNewUser(new UserRequest("user1", "12345", "user1@gmail.com", "12345"));
            userService.addNewUser(new UserRequest("user2", "12345", "user2@gmail.com", "12345"));
            userService.addNewUser(new UserRequest("admin", "12345", "admin@gmail.com", "12345"));
            userService.addRoleToUser(new RoleUserRequest("ADMIN","admin"));
            userService.addRoleToUser(new RoleUserRequest("USER","admin"));
            userService.addRoleToUser(new RoleUserRequest("USER","user1"));
            userService.addRoleToUser(new RoleUserRequest("USER","user2"));


        };
    }
    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
