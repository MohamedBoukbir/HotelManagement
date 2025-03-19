package com.hotelmanagementbackend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Hotel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private String name ;
    private String description;
    private String address ;
    private double latitude;
    private double longitude;
    private double price ;
    private String  mainPhoto;
    @ElementCollection
    @CollectionTable(name="hotel_photos",joinColumns = @JoinColumn(name="hotel_id"))
    private List<String> galleryPhotos;
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private AppUser user;

}
