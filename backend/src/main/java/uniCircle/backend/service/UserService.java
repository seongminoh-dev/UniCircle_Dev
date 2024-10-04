package uniCircle.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.entity.User;
import uniCircle.backend.repository.UserRepository;
import uniCircle.backend.util.JwtUtil;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder; // 비밀번호 암호화를 위한 인코더
    private final JwtUtil jwtUtil;

    // 회원 가입 메서드
    @Transactional
    public UserDTO registerUser(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .name(userDTO.getName())
                .email(userDTO.getEmail())
                .nickname(userDTO.getNickname())
                .roles(userDTO.getRoles())
                .password(passwordEncoder.encode(userDTO.getPassword())) // 비밀번호 암호화
                .createdAt(LocalDateTime.now())
                .lastSeen(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        return UserDTO.fromEntity(savedUser);
    }

//    // 로그인 메서드
//    public String loginUser(String email, String password) {
//        Optional<User> userOptional = userRepository.findByEmail(email);
//
//        if (userOptional.isEmpty()) {
//            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
//        }
//
//        User user = userOptional.get();
//
//        if (!passwordEncoder.matches(password, user.getPassword())) {
//            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
//        }
//
//        // JWT 토큰 생성 및 반환
//        return jwtUtil.generateToken(user.getEmail());
//    }
//
//    // 사용자 조회 메서드 (토큰을 통해 사용자 정보 조회)
//    public UserDTO getUserFromToken(String token) {
//        String email = jwtUtil.extractUsername(token);
//        Optional<User> userOptional = userRepository.findByEmail(email);
//
//        if (userOptional.isEmpty()) {
//            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
//        }
//
//        return UserDTO.fromEntity(userOptional.get());
//    }
}