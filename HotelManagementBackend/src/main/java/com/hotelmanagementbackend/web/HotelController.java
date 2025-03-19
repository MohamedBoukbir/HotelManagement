package com.hotelmanagementbackend.web;

import com.hotelmanagementbackend.dtos.HotelRequest;
import com.hotelmanagementbackend.dtos.HotelResponse;
import com.hotelmanagementbackend.services.HotelService;
import com.hotelmanagementbackend.services.PhotoStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin("*")
@RequestMapping("api/")
public class HotelController {

    private final HotelService hotelService;
    private final PhotoStorageService photoStorageService;
    @GetMapping("/hotels")
    public ResponseEntity<List<HotelResponse>> getAllHotels() {
        return ResponseEntity.ok(hotelService.findAllHotels());
    }

    @PostMapping( value ="/user/hotels" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HotelResponse> addHotel(
            @Valid HotelRequest hotelRequest,
            @RequestParam(value = "mainPhoto",required = false) MultipartFile mainPhoto,
            @RequestParam(value = "galleryPhotos",required = false) MultipartFile[] galleryPhotos) {
        return ResponseEntity.ok(hotelService.createHotel(hotelRequest,mainPhoto,galleryPhotos));
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) throws IOException {
        Path filePath = photoStorageService.load(filename);
        Resource file = new FileSystemResource(filePath);

        String contentType = Files.probeContentType(filePath);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @DeleteMapping("/admin/hotels/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/user/hotels/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HotelResponse> updateHotel(
            @Valid HotelRequest hotelRequest,
            @PathVariable Long id,
            @RequestParam(value = "mainPhoto", required = false) MultipartFile mainPhoto,
            @RequestParam(value = "galleryPhotos", required = false) MultipartFile[] galleryPhotos) {

        HotelResponse updatedHotel = hotelService.updateHotel(
                hotelRequest, id, mainPhoto, galleryPhotos);

        return ResponseEntity.ok(updatedHotel);
    }
}
