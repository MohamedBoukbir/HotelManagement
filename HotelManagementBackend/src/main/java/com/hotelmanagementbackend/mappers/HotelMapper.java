package com.hotelmanagementbackend.mappers;

import com.hotelmanagementbackend.dtos.HotelRequest;
import com.hotelmanagementbackend.dtos.HotelResponse;
import com.hotelmanagementbackend.entities.Hotel;
import org.springframework.stereotype.Service;

@Service
public class HotelMapper {

    public HotelResponse fromHotel(Hotel hotel) {
        return new HotelResponse (
                hotel.getId(),
                hotel.getName(),
                hotel.getDescription(),
                hotel.getAddress(),
                hotel.getLatitude(),
                hotel.getLongitude(),
                hotel.getPrice(),
                hotel.getMainPhoto(),
                hotel.getGalleryPhotos()
                 );
    }

    public Hotel toHotel(HotelRequest hotelRequest) {
        return Hotel.builder()
                .name(hotelRequest.name())
                .description(hotelRequest.description())
                .address(hotelRequest.address())
                .latitude(hotelRequest.latitude())
                .longitude(hotelRequest.longitude())
                .price(hotelRequest.price())
                .build();
    }
}
