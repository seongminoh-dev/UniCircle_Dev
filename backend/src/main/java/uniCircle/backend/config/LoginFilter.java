package uniCircle.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import uniCircle.backend.entity.PrincipalDetails;
import uniCircle.backend.util.JwtUtil;

import java.util.Collection;
import java.util.Iterator;

@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    private final JwtUtil jwtUtil;

    public LoginFilter(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
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
        String username = customUserDetails.getUsername();

        // 사용자의 권한 목록을 가져옴
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        // 권한 목록의 iterator를 생성
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        // 첫 번째 권한을 가져옴
        GrantedAuthority auth = iterator.next();

        // 권한의 이름(역할)을 가져옴
        String role = auth.getAuthority();

        // JWT 토큰을 생성함 (username, role, 유효기간 10시간)
        String token = jwtUtil.createJwt(username, role, 60 * 60 * 10L);

        // 응답 헤더에 "Authorization" 헤더를 추가하고, 값으로 생성된 JWT 토큰을 설정함
        response.addHeader("Authorization", "Bearer " + token);
    }



    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        response.setStatus(401);
    }
}