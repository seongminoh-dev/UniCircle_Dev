package uniCircle.backend.service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdmissionFormCustomException extends RuntimeException {
    AdmissionFormErrorCode admissionFormErrorCode;
}
