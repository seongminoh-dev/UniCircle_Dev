package uniCircle.backend.controller;

import io.jsonwebtoken.ExpiredJwtException;
import io.swagger.v3.oas.annotations.Operation;
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
import uniCircle.backend.service.UserService;
import uniCircle.backend.util.JwtUtil;

import java.util.Date;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

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
                    description = "Invalid username or password")
    })
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        log.info("실행");
        try {
            // AuthenticationManager로 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            log.info("인증성공");
            // 인증 성공 시 JWT 생성
            String AccessToken = jwtUtil.createJwt("access", email, authentication.getAuthorities().iterator().next().getAuthority(), 600000L);
            String RefreshToken = jwtUtil.createJwt("refresh", email, authentication.getAuthorities().iterator().next().getAuthority(), 24000000L);

            String body = "AccessToken: Bearer " + AccessToken + "\nRefreshToken: Bearer " + RefreshToken;
            return new ResponseEntity<>(body, HttpStatus.OK);
        } catch (AuthenticationException e) {
            // 인증 실패 시 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
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
