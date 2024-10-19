package uniCircle.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import uniCircle.backend.entity.PrincipalDetails;
import uniCircle.backend.entity.RefreshToken;
import uniCircle.backend.repository.RefreshTokenRepository;
import uniCircle.backend.util.JwtUtil;

import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    private final JwtUtil jwtUtil;

    private final Long accessTokenExpireTime;
    private final Long refreshTokenExpireTime;

    private final RefreshTokenRepository refreshTokenRepository;

    public LoginFilter(AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil,
                       Long accessTokenExpireTime,
                       Long refreshTokenExpireTime,
                       RefreshTokenRepository refreshTokenRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.accessTokenExpireTime = accessTokenExpireTime;
        this.refreshTokenExpireTime = refreshTokenExpireTime;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        //필터를 통과할 때 실행되는 메소드
        //클라이언트 요청에서 username, password 추출
        String username = obtainUsername(request);
        String password = obtainPassword(request);

        //username과 password를 토큰으로 담음
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

        // 토큰을 AuthenticationManager로 전달
        return authenticationManager.authenticate(authToken);
    }



    //로그인 성공시 실행하는 메소드 (JWT 발급)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
        // 사용자 인증 정보에서 CustomUserDetails 객체를 가져옴
        PrincipalDetails customUserDetails = (PrincipalDetails) authentication.getPrincipal();

        // 사용자 이름을 가져옴
        // 하지만 이름은 중복될 수 있으므로 email을 받을거임
        // getUsername은 오버라이딩된 메소드라서 이름을 바꿀 수 없음
        String email = customUserDetails.getUsername();

        // 사용자의 권한 목록을 가져옴
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        // 권한 목록의 iterator를 생성
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        // 첫 번째 권한을 가져옴
        GrantedAuthority auth = iterator.next();

        // 권한의 이름(역할)을 가져옴
        String role = auth.getAuthority();

        // JWT 토큰을 생성함 Access Token(username, role, 유효기간 1시간), Refresh Token(username, role, 유효기간 24시간)
        String accessToken = jwtUtil.createJwt("access", email, role, accessTokenExpireTime);
        String refreshToken = jwtUtil.createJwt("access", email, role, refreshTokenExpireTime);

        //Refresh 토큰 저장
        addRefreshEntity(email, refreshToken, 86400000L);

        //응답 설정
        response.setHeader("access", accessToken);
        response.addCookie(createCookie("refresh", refreshToken));
        response.setStatus(HttpStatus.OK.value());
    }


    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        response.setStatus(401);
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