package com.hotelmanagementbackend.handler;


import com.hotelmanagementbackend.exception.HotelNotFoundException;
import com.hotelmanagementbackend.exception.StorageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException exp) {
       var errors =new HashMap<String,String>();
       exp.getBindingResult().getAllErrors().forEach((error)->{
           var fieldName=((FieldError)error).getField();
           var errorMessage=error.getDefaultMessage();
           errors.put(fieldName,errorMessage);
       });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(errors));
    }

    @ExceptionHandler(StorageException.class)
    public ResponseEntity<String> handleStorageException(StorageException exp) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exp.getMsg());
    }
    @ExceptionHandler(HotelNotFoundException.class)
    public ResponseEntity<String> handleHotelNotFoundException(HotelNotFoundException exp) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exp.getMsg());
    }
}
