package com.hotelmanagementbackend.services;

import com.hotelmanagementbackend.exception.StorageException;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class PhotoStorageService {
    private final Path rootLocation = Paths.get("uploads");

    @PostConstruct
    public void init (){
        try {
            Files.createDirectories(rootLocation);
        }catch (IOException e){
            throw new StorageException("Could not initialize the storage");
        }
    }

    public String store(MultipartFile file){
        try {
            if (file.isEmpty()){
                throw new StorageException("failed to store empty file");
            }
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(),this.rootLocation.resolve(filename));
            return filename;
        }
        catch (IOException e){
            throw new StorageException("failed to store file");
        }
    }

    public Path load(String filename){
        return rootLocation.resolve(filename);
    }
}
