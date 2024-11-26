package uniCircle.backend.service;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.entity.Role;
import uniCircle.backend.entity.User;
import uniCircle.backend.repository.UserRepository;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class UserServiceTest {

    @Autowired
    private UserService userService; // 테스트 대상 서비스

    @Autowired
    private UserRepository userRepository; // 실제 Repository 사용

    @Autowired
    private PasswordEncoder passwordEncoder; // 실제 PasswordEncoder 사용

    @Test
    public void testRegisterUser_Success() {
        // Given: 테스트용 사용자 데이터 생성
        UserDTO userDTO = UserDTO.builder()
                .name("John Doe")
                .email("johndoe@uos.ac.kr")
                .nickname("johndoe")
                .password("securepassword")
                .roles(Role.WANT_JOIN)
                .build();

        // When: 사용자 등록 메서드 호출
        UserDTO registeredUser = userService.registerUser(userDTO);

        // Then: 결과 검증
        assertNotNull(registeredUser);
        assertEquals(userDTO.getEmail(), registeredUser.getEmail());
        assertEquals(userDTO.getName(), registeredUser.getName());
        assertEquals(userDTO.getNickname(), registeredUser.getNickname());

        // 추가 검증: DB에 저장된 데이터 확인
        Optional<User> savedUser = userRepository.findByEmail(userDTO.getEmail());
        assertTrue(savedUser.isPresent());
        assertEquals("John Doe", savedUser.get().getName());
        assertTrue(passwordEncoder.matches("securepassword", savedUser.get().getPassword()));
    }
}