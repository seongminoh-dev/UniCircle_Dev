package uniCircle.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uniCircle.backend.entity.Role;

@Getter
@Setter
@NoArgsConstructor
public class UserRequest {
    @Schema(
            name = "name",
            description = "name",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "jaewon")
    private String name;

    @Schema(
            name = "email",
            description = "email",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "jaewon@email.com")
    private String email;

    @Schema(
            name = "password",
            description = "password",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "myPassWord!")
    private String password;
}