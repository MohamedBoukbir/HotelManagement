package com.hotelmanagementbackend.services;

import com.hotelmanagementbackend.dtos.HotelRequest;
import com.hotelmanagementbackend.dtos.HotelResponse;
import com.hotelmanagementbackend.entities.Hotel;
import com.hotelmanagementbackend.exception.HotelNotFoundException;
import com.hotelmanagementbackend.exception.StorageException;
import com.hotelmanagementbackend.mappers.HotelMapper;
import com.hotelmanagementbackend.repositories.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {
    private final  HotelRepository hotelRepository;
    private final  HotelMapper hotelMapper;
    private final PhotoStorageService photoStorageService;
    @Override
    public List<HotelResponse> findAllHotels() {
        return hotelRepository.findAll().stream()
                .map(hotelMapper::fromHotel)
                .collect(Collectors.toList());
    }

    @Override
    public HotelResponse createHotel(HotelRequest hotelRequest, MultipartFile mainPhoto, MultipartFile[] galleryPhotos) {
        String mainPhotoFilename = photoStorageService.store(mainPhoto);
        List<String> galleryPhotoFilenames = new ArrayList<>();
        for (MultipartFile file : galleryPhotos) {
            String filename = photoStorageService.store(file);
            galleryPhotoFilenames.add(filename);
        }
        Hotel hotel = new Hotel();
        hotel.setName(hotelRequest.name());
        hotel.setDescription(hotelRequest.description());
        hotel.setAddress(hotelRequest.address());
        hotel.setLatitude(hotelRequest.latitude());
        hotel.setLongitude(hotelRequest.longitude());
        hotel.setPrice(hotelRequest.price());
        hotel.setMainPhoto(mainPhotoFilename);
        hotel.setGalleryPhotos(galleryPhotoFilenames);
        Hotel savedHotel = hotelRepository.save(hotel);
        return hotelMapper.fromHotel(savedHotel);
    }
    @Override
    public void deleteHotel(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new HotelNotFoundException("Hotel not found with ID: " + id));

        if (hotel.getMainPhoto() != null) {
            try {
                Files.deleteIfExists(photoStorageService.load(hotel.getMainPhoto()));
            } catch (IOException e) {
                throw new StorageException("Error while deleting the main photo");
            }
        }

        if (hotel.getGalleryPhotos() != null) {
            for (String photo : hotel.getGalleryPhotos()) {
                try {
                    Files.deleteIfExists(photoStorageService.load(photo));
                } catch (IOException e) {
                    throw new StorageException("Error while deleting a gallery photo");
                }
            }
        }
        hotelRepository.delete(hotel);
    }

     @Override
     public HotelResponse updateHotel(HotelRequest hotelRequest,Long id,
                                      MultipartFile mainPhoto, MultipartFile[] galleryPhotos) {
         Hotel hotel = hotelRepository.findById(id)
                 .orElseThrow(() -> new HotelNotFoundException("Hotel not found with ID: " + id));

         if (mainPhoto != null && !mainPhoto.isEmpty() && hotel.getMainPhoto() != null) {
             try {
                 Files.deleteIfExists(photoStorageService.load(hotel.getMainPhoto()));
             } catch (IOException e) {
                 throw new StorageException("Error while deleting the main photo" +e);
             }
         }

         if (galleryPhotos != null && galleryPhotos.length > 0 && hotel.getGalleryPhotos() != null) {
             for (String photo : hotel.getGalleryPhotos()) {
                 try {
                     Files.deleteIfExists(photoStorageService.load(photo));
                 } catch (IOException e) {
                     throw new StorageException("Error while deleting a gallery photo"+ e);
                 }
             }
         }

         hotel.setName(hotelRequest.name());
         hotel.setDescription(hotelRequest.description());
         hotel.setAddress(hotelRequest.address());
         hotel.setLatitude(hotelRequest.latitude());
         hotel.setLongitude(hotelRequest.longitude());
         hotel.setPrice(hotelRequest.price());

         if (mainPhoto != null && !mainPhoto.isEmpty()) {
             String mainPhotoFilename = photoStorageService.store(mainPhoto);
             hotel.setMainPhoto(mainPhotoFilename);
         }


         if (galleryPhotos != null && galleryPhotos.length > 0) {
             List<String> galleryPhotoFilenames = new ArrayList<>();
             for (MultipartFile file : galleryPhotos) {
                 String filename = photoStorageService.store(file);
                 galleryPhotoFilenames.add(filename);
             }
             hotel.setGalleryPhotos(galleryPhotoFilenames);
         }

         Hotel updatedHotel = hotelRepository.save(hotel);

         return hotelMapper.fromHotel(updatedHotel);
     }
}
