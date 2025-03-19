package com.hotelmanagementbackend.dtos;

import jakarta.validation.constraints.NotNull;

public record HotelRequest(
        @NotNull(message = "Hotel name is required ")
        String name,
        @NotNull(message="Hotel description is required")
        String description,
        @NotNull(message = "Hotel Address is required ")
        String address,
        @NotNull(message = "Hotel latitude is required ")
        double latitude,
        @NotNull(message = "Hotel longitude is required ")
        double longitude,
        @NotNull(message = "Hotel price is required ")
        double price
) {
}
