package com.hotelmanagementbackend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="users")
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true)
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    @Column(unique=true)
    private String email;
    private String phone;
    @ManyToMany(fetch = FetchType.EAGER)
    private List<AppRole> roles;

//    @OneToMany( mappedBy = "user")
//    private List<Hotel> hotels;

}
