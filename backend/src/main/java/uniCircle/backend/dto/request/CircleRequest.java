package uniCircle.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.Set;

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
            name = "hashtagContents",
            description = "해시태그 리스트",
            type = "array",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED,
            example = "[\"a\",\"b\",\"c\"]")
    private Set<String> hashtagContents;

    @Schema(
            name = "questions",
            description = "admission form questions",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example =
                    "circle.question" +
                            "{" +
                            "\"questions\" :" +
                            "[" +
                            "\"question1\"," +
                            "\"question2\"," +
                            "\"question3\"" +
                            "]" +
                            "}")
    private String questions;

}