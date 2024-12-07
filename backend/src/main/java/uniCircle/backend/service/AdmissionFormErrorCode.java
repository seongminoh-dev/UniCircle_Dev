package uniCircle.backend.service;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum AdmissionFormErrorCode {
    BAD_REQUEST_CONTENT(
        "ERR_A01",
        "요청 본문이 일부 또는 전부 누락됨",
        HttpStatus.BAD_REQUEST),
    BAD_REQUEST_STATUS(
        "ERR_A02",
        "존재하지 않는 상태가 입력됨",
        HttpStatus.BAD_REQUEST),
    NOT_FOUND_USER(
        "ERR_A03",
        "유저가 존재하지 않음",
        HttpStatus.NOT_FOUND),
    NOT_FOUND_CIRCLE(
        "ERR_A04",
        "동아리가 존재하지 않음",
        HttpStatus.NOT_FOUND),
    NOT_FOUND_FORM(
        "ERR_A05",
        "입부신청서가 존재하지 않음",
        HttpStatus.NOT_FOUND),
    BAD_REQUEST_ALREADY_TAKEN(
        "ERR_A06",
        "이미 처리되었거나 잘못된 요청",
        HttpStatus.BAD_REQUEST);

    AdmissionFormErrorCode(String errorCode, String errorMessage, HttpStatus httpStatus) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.httpStatus = httpStatus;
    }
    
    private final String errorCode;
    private final String errorMessage;
    private final HttpStatus httpStatus;
}
