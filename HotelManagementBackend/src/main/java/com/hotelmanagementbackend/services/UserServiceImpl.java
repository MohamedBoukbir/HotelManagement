package com.hotelmanagementbackend.services;

import com.hotelmanagementbackend.dtos.RoleUserRequest;
import com.hotelmanagementbackend.dtos.UserRequest;
import com.hotelmanagementbackend.entities.AppRole;
import com.hotelmanagementbackend.entities.AppUser;
import com.hotelmanagementbackend.repositories.AppRoleRepository;
import com.hotelmanagementbackend.repositories.AppUserRepository;
import lombok.AllArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final AppUserRepository appUserRepository;
    private  final AppRoleRepository appRoleRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public AppUser addNewUser(UserRequest user) {
       AppUser appuser = appUserRepository.findByUsername(user.username());
       if(appuser !=null) throw new RuntimeException("this user already exist");
       if (!user.password().equals(user.confirmPassword())) throw new RuntimeException("Password not match");
       appuser=AppUser.builder()
               .username(user.username())
               .password(passwordEncoder.encode(user.password()))
               .email(user.email())
               .roles(new ArrayList<>())
               .build();
        return appUserRepository.save(appuser);
    }

    @Override
    public AppRole addNewRole(String roleName) {
        AppRole appRole =appRoleRepository.findById(roleName).orElse(null);
        if(appRole!=null) throw new RuntimeException("role already exist");
        appRole= AppRole.builder()
                .role(roleName)
                .build();
        return appRoleRepository.save(appRole);
    }

    @Override
    public void addRoleToUser(RoleUserRequest roleToUser) {
     AppRole appRole = appRoleRepository.findById(roleToUser.role()).get();
     AppUser appUser = appUserRepository.findByUsername(roleToUser.username());
     appUser.getRoles().add(appRole);

//     appUserRepository.save(appUser);

    }

    @Override
    public void removeRoleFromUser(RoleUserRequest roleFromUser) {
        AppRole appRole = appRoleRepository.findById(roleFromUser.role()).get();
        AppUser appUser = appUserRepository.findByUsername(roleFromUser.username());
        appUser.getRoles().remove(appRole);
    }

    @Override
    public AppUser loadUserByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }
}
