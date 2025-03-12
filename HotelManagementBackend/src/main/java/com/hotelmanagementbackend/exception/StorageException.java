package com.hotelmanagementbackend.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper=true)
@Data
public class StorageException extends RuntimeException {
    private final String msg;
}
