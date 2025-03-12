package com.hotelmanagementbackend.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper=true)
@Data
public class HotelNotFoundException extends RuntimeException {
    private final String msg;


}
