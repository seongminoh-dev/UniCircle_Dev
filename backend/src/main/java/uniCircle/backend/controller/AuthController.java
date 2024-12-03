package uniCircle.backend.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import io.jsonwebtoken.ExpiredJwtException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.dto.request.UserRequest;
import uniCircle.backend.dto.response.ErrorResponse;
import uniCircle.backend.dto.response.SuccessResponse;
import uniCircle.backend.entity.RefreshToken;
import uniCircle.backend.entity.Role;
import uniCircle.backend.repository.RefreshTokenRepository;
import uniCircle.backend.service.MailService;
import uniCircle.backend.service.PasswordResetService;
import uniCircle.backend.service.UserService;
import uniCircle.backend.util.JwtUtil;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final MailService mailService;
    private final PasswordResetService passwordResetService;

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
        try{
            userService.registerUser(userDTO);
            return "redirect:/";
        } catch(Exception e){
            log.error("{}",e.getMessage());
            return e.getMessage();
        }


    }


    @Operation(summary = "User login", description = "Login을 실행한 뒤 JWT 토큰을 반환 함.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully logged in",
                    content = @Content(
                            schema = @Schema(implementation = String.class))),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid email or password")
    })
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        try {
            // AuthenticationManager로 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            log.info("인증성공");

            UserDTO userDTO = userService.findByEmail(email);

            // 인증 성공 시 JWT 생성
            String accessToken = jwtUtil.createJwt("access", email, authentication.getAuthorities().iterator().next().getAuthority(), 600000L);
            String refreshToken = jwtUtil.createJwt("refresh", email, authentication.getAuthorities().iterator().next().getAuthority(), 24000000L);

            JsonObject jsonResponse = new JsonObject();
            jsonResponse.addProperty("accessToken", "Bearer " + accessToken);
            jsonResponse.addProperty("refreshToken", "Bearer " + refreshToken);
            jsonResponse.addProperty("userId",userDTO.getUserId());
            jsonResponse.addProperty("email",userDTO.getEmail());
            jsonResponse.addProperty("nickname",userDTO.getNickname());
            jsonResponse.addProperty("name",userDTO.getName());
            jsonResponse.addProperty("role", String.valueOf(userDTO.getRoles()));

            Gson gson = new Gson();
            return new ResponseEntity<>(gson.toJson(jsonResponse), HttpStatus.OK);
        } catch (AuthenticationException e) {
            // 인증 실패 시 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @Operation(summary = "refresh", description = "refresh 토큰으로 access 토큰 재발급")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successful",
                    content = @Content(
                            schema = @Schema(implementation = String.class))),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid authority")
    })
    @PostMapping("/refresh")
    public ResponseEntity<String> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for(Cookie cookie : cookies) {
            if(cookie.getName().equals("refresh")){
                refresh = cookie.getValue();
            }
        }

        if(refresh == null){
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        try{
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e){
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {
            //response status code
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        //DB에 저장되어 있는지 확인
        Boolean isExist = refreshTokenRepository.existsByTokenContent(refresh);
        if (!isExist) {

            //response body
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }


        String email = jwtUtil.getEmail(refresh);
        String role = jwtUtil.getRole(refresh);

        //make new JWT
        String newAccess = jwtUtil.createJwt("access", email, role, 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", email, role, 86400000L);

        //Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장
        refreshTokenRepository.deleteByTokenContent(refresh);
        addRefreshEntity(email, newRefresh, 86400000L);

        //response
        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        return new ResponseEntity<>(newAccess, HttpStatus.OK);
    }


    // 이메일 인증 코드 전송
    @PostMapping("/send-verification-code")
    @Operation(summary = "Send email verification code")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Verification code sent successfully",
                    content = @Content(
                            schema = @Schema(implementation = String.class))),
            @ApiResponse(
                    responseCode = "400",
                    description = "Failed to send verification code",
                    content = @Content(
                            schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<String> sendVerificationCode(
            @Parameter(
            description = "인증 코드가 보내질 이메일 주소",
            example = "user@example.com",
            required = true)
            @RequestParam String email) {
        try {
            String verificationCode = mailService.generateAndStoreVerificationCode(email);
            mailService.sendVerificationEmail(email, verificationCode);
            return ResponseEntity.ok("Verification code sent successfully");
        } catch (Exception e) {
            log.error("Failed to send verification code: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to send verification code");
        }
    }

    // 이메일 인증 코드 검증
    @PostMapping("/verify-code")
    @Operation(summary = "Verify email using verification code")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Email verified successfully",
                    content = @Content(
                            schema = @Schema(implementation = String.class))),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid or expired verification code",
                    content = @Content(
                            schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<String> verifyCode(@RequestParam String email, @RequestParam String code) {
        boolean isVerified = mailService.verifyCode(email, code);
        if (isVerified) {
            return ResponseEntity.ok("Email verified successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired verification code");
        }
    }

    @PostMapping("/reset-password")
    @Operation(
            summary = "Reset user password",
            description = "Resets the password for a user and sends the new password to their email."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Password reset successfully",
                    content = @Content(schema = @Schema(implementation = String.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid username or email",
                    content = @Content(schema = @Schema(implementation = String.class))
            )
    })
    public ResponseEntity<String> resetPassword(
            @Parameter(
                    description = "The username of the account to reset the password for.",
                    example = "user123",
                    required = true
            )
            @RequestParam String username,
            @Parameter(
                    description = "The email associated with the account.",
                    example = "user@example.com",
                    required = true
            )
            @RequestParam String email
    ) {
        boolean isReset = passwordResetService.resetPassword(username, email);
        if (isReset) {
            return ResponseEntity.ok("A new password has been sent to your email.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid username or email.");
        }
    }

    @PostMapping("/change-password")
    @Operation(
            summary = "Change user password",
            description = "Allows a user to change their password by providing a valid email, username, and a new password."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Password changed successfully",
                    content = @Content(schema = @Schema(implementation = String.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid username or email",
                    content = @Content(schema = @Schema(implementation = String.class))
            )
    })
    public ResponseEntity<String> changePassword(@RequestParam String email,
                                                 @RequestParam String username,
                                                 @RequestParam String newPassword) {
        boolean result = userService.changePassword(email, username, newPassword);
        if (result) {
            return ResponseEntity.ok("Password changed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid username or email");
        }
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        //cookie.setPath("/");
        cookie.setHttpOnly(true);
        return cookie;
    }

    private void addRefreshEntity(String email, String refresh, Long expiredMs) {

        Date date = new Date(System.currentTimeMillis() + expiredMs);

        RefreshToken refreshToken = RefreshToken.builder().
                email(email).
                tokenContent(refresh).
                expiration(date.toString()).
                build();

        refreshTokenRepository.save(refreshToken);
    }
}
