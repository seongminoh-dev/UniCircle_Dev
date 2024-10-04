package uniCircle.backend.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public class ErrorResponse {

    @Schema(
            name = "errorCode",
            type = "String",
            description = "Error code representing the specific error",
            example = "ERR_001"
    )
    private String errorCode;

    @Schema(
            name = "errorMessage",
            type = "String",
            description = "Detailed error message describing the cause of the error",
            example = "An unexpected error occurred."
    )
    private String errorMessage;

    @Schema(
            name = "statusCode",
            type = "Integer",
            description = "HTTP status code of the response",
            example = "400"
    )
    private int statusCode;

    @Schema(
            name = "timestamp",
            type = "String",
            description = "The timestamp when the error occurred",
            example = "2023-10-03T10:15:30"
    )
    private String timestamp;
}
