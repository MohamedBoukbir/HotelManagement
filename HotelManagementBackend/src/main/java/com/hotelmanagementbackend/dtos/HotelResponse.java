package com.hotelmanagementbackend.dtos;

import java.util.List;

public record HotelResponse(
        Long id ,
        String name,
        String description,
        String address,
        double latitude,
        double longitude,
        double price,
        String  mainPhoto,
        List<String> galleryPhotos
) {
}
