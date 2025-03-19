package com.hotelmanagementbackend.dtos;

import jakarta.validation.constraints.NotNull;

public record UserRequest(
        @NotNull(message = "username  is required ")
        String username,
        @NotNull(message = "password  is required ")
        String password,
        @NotNull(message = "email  is required ")
        String email,
        @NotNull(message = "confirm password  is required ")
        String confirmPassword
) {
}
