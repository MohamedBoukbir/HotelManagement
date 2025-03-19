package com.hotelmanagementbackend.services;

import com.hotelmanagementbackend.dtos.HotelRequest;
import com.hotelmanagementbackend.dtos.HotelResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface HotelService {
    List<HotelResponse> findAllHotels();
    HotelResponse createHotel(HotelRequest hotelRequest, MultipartFile mainPhoto, MultipartFile[] galleryPhotos);

    void deleteHotel(Long id);

    HotelResponse updateHotel(HotelRequest hotelRequest, Long id,
                              MultipartFile mainPhoto, MultipartFile[] galleryPhotos);
}
