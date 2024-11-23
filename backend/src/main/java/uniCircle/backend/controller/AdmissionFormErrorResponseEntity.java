package uniCircle.backend.controller;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import uniCircle.backend.service.AdmissionFormErrorCode;

@Data
@Builder
public class AdmissionFormErrorResponseEntity {
    private String errorCode;
    private String errorMessage;
    private Integer statusCode;
    private String timestamp;

    public static ResponseEntity<AdmissionFormErrorResponseEntity> toResponseEntity(AdmissionFormErrorCode e) {
        return ResponseEntity
            .status(e.getHttpStatus())
            .body(AdmissionFormErrorResponseEntity.builder()
                        .errorCode(e.getErrorCode())
                        .errorMessage(e.getErrorMessage())
                        .statusCode(e.getHttpStatus().value())
                        .timestamp(LocalDateTime.now().toString())
                        .build());
    }
}
