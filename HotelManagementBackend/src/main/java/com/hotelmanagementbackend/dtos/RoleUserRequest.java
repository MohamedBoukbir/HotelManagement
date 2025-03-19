package com.hotelmanagementbackend.dtos;

import jakarta.validation.constraints.NotNull;

public record RoleUserRequest(
        @NotNull(message = "role  is required ")
        String role,
        @NotNull(message = "username  is required ")
        String username
) {
}
