package uniCircle.backend.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public class SuccessResponse {

    @Schema(
            name = "message",
            type = "String",
            description = "Response message field",
            example = "Success!"
    )
    private String message;

    @Schema(
            name = "statusCode",
            type = "Integer",
            description = "HTTP status code of the response",
            example = "200"
    )
    private int statusCode;

    @Schema(
            name = "timestamp",
            type = "String",
            description = "The timestamp when the response was generated",
            example = "2023-10-03T10:15:30"
    )
    private String timestamp;
}