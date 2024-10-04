package uniCircle.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        // OpenAPI 객체를 생성하고, Swagger 문서에 대한 설정을 추가합니다.
        return new OpenAPI()
                // Swagger 문서에서 사용할 보안 스키마를 정의하는 Components 객체를 설정합니다.
                .components(new Components()
                        .addSecuritySchemes("bearer-key", // 보안 스키마의 이름을 "bearer-key"로 정의합니다.
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP) // 보안 방식의 타입을 HTTP로 설정합니다.
                                        .scheme("bearer") // HTTP 인증 방식으로 "Bearer" 토큰을 사용함을 나타냅니다.
                                        .bearerFormat("JWT"))) // Bearer 토큰의 형식을 명시적으로 "JWT"로 설정합니다.
                // 모든 API 엔드포인트에 대해 정의된 보안 요구 사항을 추가합니다.
                .addSecurityItem(new SecurityRequirement().addList("bearer-key")) // 각 요청에서 "bearer-key" 스키마를 요구하도록 설정합니다.
                // Swagger UI에 표시될 API 정보(제목, 설명 등)를 설정합니다.
                .info(apiInfo()); // API의 메타데이터를 설정합니다. 'apiInfo()'는 해당 정보를 담고 있는 메서드입니다.
    }

    private Info apiInfo() {
        return new Info()
                .title("UniCircle")
                .description("University Of Seoul Circle Application")
                .version("0.1.0");
    }
}