package com.hotelmanagementbackend.web;

import com.hotelmanagementbackend.dtos.RoleRequest;
import com.hotelmanagementbackend.dtos.RoleUserRequest;
import com.hotelmanagementbackend.dtos.UserRequest;
import com.hotelmanagementbackend.entities.AppRole;
import com.hotelmanagementbackend.entities.AppUser;
import com.hotelmanagementbackend.repositories.AppRoleRepository;
import com.hotelmanagementbackend.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AppRoleRepository appRoleRepository;

    @PostMapping("users")
    public ResponseEntity<AppUser> addUser(@RequestBody @Valid UserRequest user) {
          AppUser userSaved = userService.addNewUser(user);
          userService.addRoleToUser( new RoleUserRequest("USER",userSaved.getUsername()));
        return ResponseEntity.ok(userSaved);
    }


    @PostMapping("accounts/roles")
    public ResponseEntity<AppRole> addRole(@RequestBody RoleRequest roleRequest){
        return ResponseEntity.ok(userService.addNewRole(roleRequest.role()));
    }
    @GetMapping("accounts/roles")
    public ResponseEntity<List<AppRole>> getRole(){
        return ResponseEntity.ok(appRoleRepository.findAll());
    }

    @PostMapping("accounts/role/to/user")
    public ResponseEntity<Void> addRoleToUser(@RequestBody @Valid RoleUserRequest roleToUser) {
        System.out.println(roleToUser.role()+roleToUser.username());
      userService.addRoleToUser(roleToUser);
      return ResponseEntity.noContent().build();
    }
    @PostMapping("accounts/role/from/user")
    public ResponseEntity<Void> removeRoleFromUser(@RequestBody @Valid RoleUserRequest roleFromUser) {
        userService.removeRoleFromUser(roleFromUser);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("accounts/user/{username}")
    public ResponseEntity<AppUser>loadUserByUsername (@PathVariable("username") String username){
        return ResponseEntity.ok(userService.loadUserByUsername(username));
    }





}
