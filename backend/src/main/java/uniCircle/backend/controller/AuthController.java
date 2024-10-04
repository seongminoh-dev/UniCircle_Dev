package uniCircle.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.dto.request.UserRequest;
import uniCircle.backend.dto.response.ErrorResponse;
import uniCircle.backend.dto.response.SuccessResponse;
import uniCircle.backend.entity.Role;
import uniCircle.backend.service.UserService;
import uniCircle.backend.util.JwtUtil;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    @Operation(
            summary = "회원가입",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successful operation",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = SuccessResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Bad request",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = ErrorResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Bad credentials",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
    // user는 폼에 입력한 정보를 통해 바인딩
    public String register(@RequestBody UserRequest userRequest) {
        UserDTO userDTO = UserDTO.builder()
                .name(userRequest.getName())
                .nickname(userRequest.getNickname())
                .email(userRequest.getEmail())
                .roles(Role.WANT_JOIN)
                .password(userRequest.getPassword())
                .build();
        userService.registerUser(userDTO);
        return "redirect:/";
    }


    @Operation(summary = "User login", description = "Login을 실행한 뒤 JWT 토큰을 반환 함. 주의!!! username에는 email을 넣어야 제대로 동작함.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully logged in",
                    content = @Content(
                            schema = @Schema(implementation = String.class))),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid username or password")
    })
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
        log.info("실행");
        try {
            // AuthenticationManager로 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));

            log.info("인증성공");
            // 인증 성공 시 JWT 생성
            String token = jwtUtil.createJwt(username, authentication.getAuthorities().iterator().next().getAuthority(), 60 * 60 * 10L);
            return new ResponseEntity<>("Bearer " + token, HttpStatus.OK);
        } catch (AuthenticationException e) {
            // 인증 실패 시 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }
}
