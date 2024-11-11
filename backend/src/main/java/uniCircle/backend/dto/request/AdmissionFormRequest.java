package uniCircle.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AdmissionFormRequest {

    @Schema(
            name = "circleId",
            description = "Circle ID",
            type = "Long",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "12345")
    private Long circleId;

    @Schema(
            name = "UserId",
            description = "User ID",
            type = "Long",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "67890")
    private Long userId;

    @Schema(
            name = "formContent",
            description = "Form Content",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "{\"question1\":\"answer1\",\"question2\":\"answer2\"}"
    )
    private String formContent;
}
