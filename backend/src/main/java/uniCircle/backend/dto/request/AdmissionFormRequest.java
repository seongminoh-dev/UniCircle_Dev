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
            requiredMode = Schema.RequiredMode.NOT_REQUIRED,
            example = "12345")
    private Long circleId;

    @Schema(
            name = "userId",
            description = "User ID",
            type = "Long",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED,
            example = "67890")
    private Long userId;

    @Schema(
            name = "formContent",
            description = "Form Content with [{id:int, question:text, anwser:text}...]",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "[{\"id\":0,\"question\":\"question Text\",\"answer\":\"answer Text\"},{\"id\":1,\"question\":\"question Text\",\"answer\":\"answer Text\"}]"
    )
    private String formContent;
}
