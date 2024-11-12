package uniCircle.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uniCircle.backend.entity.User;

@Getter
@Setter
@NoArgsConstructor
public class CircleRequest {
    @Schema(
            name = "name",
            description = "name",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "칸타빌레")
    private String name;

    @Schema(
            name = "description",
            description = "description",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "오케스트라 동아리")
    private String description;

    @Schema(
            name = "email",
            description = "admin user email",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "jaewon@email.com")
    private String email;

    @Schema(
            name = "questions",
            description = "admission form questions",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example =
                    "circle.question\n" +
                            "{\n" +
                            "\t\"questions\" :\n" +
                            "\t[\n" +
                            "\t\t\"question1\",\n" +
                            "\t\t\"question2\",\n" +
                            "\t\t\"question3\"\n" +
                            "\t]\n" +
                            "}")
    private String questions;

}