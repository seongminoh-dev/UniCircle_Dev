package uniCircle.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import uniCircle.backend.service.AdmissionFormCustomException;

@ControllerAdvice
public class AdmissionFormErrorHandler {
    
    @ExceptionHandler(AdmissionFormCustomException.class)
    protected ResponseEntity<AdmissionFormErrorResponseEntity> handleCustomException(AdmissionFormCustomException e){
        return AdmissionFormErrorResponseEntity.toResponseEntity(e.getAdmissionFormErrorCode());

    }
}