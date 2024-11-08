package uniCircle.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import uniCircle.backend.repository.RefreshTokenRepository;
import uniCircle.backend.util.JwtUtil;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JwtUtil jwtUtil;

    @Value("${app.jwt.token.expires-in}")
    private Long accessTokenExpireTime;

    @Value("${app.jwt.refresh-token.expires-in}")
    private Long refreshTokenExpireTime;

    private RefreshTokenRepository refreshTokenRepository;

    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JwtUtil jwtUtil) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf((auth) -> auth.disable());

        //Form 로그인 방식 disable
        http.formLogin((auth) -> auth.disable());

        //http basic 인증 방식 disable
        http.httpBasic((auth) -> auth.disable());

        //세션 설정
        http.sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http
                .addFilterBefore(new JwtFilter(jwtUtil), LoginFilter.class);

        // 로그인 필터 추가 - 인증 처리 단계에서 실행
        http.
                addFilterAt(new LoginFilter(
                        authenticationManager(authenticationConfiguration),
                        jwtUtil,
                        accessTokenExpireTime,
                        refreshTokenExpireTime,
                        refreshTokenRepository), UsernamePasswordAuthenticationFilter.class);

        //경로별 인가 작업
        http.authorizeHttpRequests((auth) -> auth
                .requestMatchers("/login", "/", "/register", "/refresh",
                        "/swagger-ui/**", "/api-docs/**", "/auth/**", "/create", "/search", "/update").permitAll()
                //.requestMatchers("/admin").hasRole("ADMIN")
                .anyRequest().authenticated());

        return http.build();
    }
}