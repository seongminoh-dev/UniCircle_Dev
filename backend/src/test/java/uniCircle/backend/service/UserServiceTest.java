package uniCircle.backend.service;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.entity.Role;
import uniCircle.backend.entity.User;
import uniCircle.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
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

    @Test
    public void testRegisterUser_EmailAlreadyExists() {
        // Given: 이미 존재하는 이메일 데이터 준비
        User existingUser = User.builder()
                .name("Jane Doe")
                .email("janedoe@uos.ac.kr")
                .nickname("janedoe")
                .password(passwordEncoder.encode("securepassword"))
                .roles(Role.WANT_JOIN)
                .createdAt(LocalDateTime.now())
                .lastSeen(LocalDateTime.now())
                .build();
        userRepository.save(existingUser);

        UserDTO userDTO = UserDTO.builder()
                .name("New User")
                .email("janedoe@uos.ac.kr") // 이미 존재하는 이메일
                .nickname("newuser")
                .password("newpassword")
                .roles(Role.WANT_JOIN)
                .build();

        // When & Then: 예외 발생 검증
        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(userDTO));
    }

    @Test
    public void testFindByEmail_Success() {
        // Given: 테스트용 사용자 데이터 저장
        User user = User.builder()
                .name("John Doe")
                .email("johndoe@uos.ac.kr")
                .nickname("johndoe")
                .password(passwordEncoder.encode("securepassword"))
                .roles(Role.WANT_JOIN)
                .createdAt(LocalDateTime.now())
                .lastSeen(LocalDateTime.now())
                .build();
        userRepository.save(user);

        // When: 이메일로 사용자 찾기
        UserDTO foundUser = userService.findByEmail("johndoe@uos.ac.kr");

        // Then: 결과 검증
        assertNotNull(foundUser);
        assertEquals("John Doe", foundUser.getName());
        assertEquals("johndoe@uos.ac.kr", foundUser.getEmail());
    }

    @Test
    public void testFindByEmail_NotFound() {
        // When & Then: 없는 이메일로 조회 시 null 반환
        UserDTO foundUser = userService.findByEmail("nonexistent@uos.ac.kr");
        assertNull(foundUser);
    }

    @Test
    public void testFindByUserId_Success() {
        // Given: 테스트용 사용자 데이터 저장
        User user = User.builder()
                .name("John Doe")
                .email("johndoe@uos.ac.kr")
                .nickname("johndoe")
                .password(passwordEncoder.encode("securepassword"))
                .roles(Role.WANT_JOIN)
                .createdAt(LocalDateTime.now())
                .lastSeen(LocalDateTime.now())
                .build();
        User savedUser = userRepository.save(user);

        // When: ID로 사용자 찾기
        UserDTO foundUser = userService.findByUserId(savedUser.getUserId());

        // Then: 결과 검증
        assertNotNull(foundUser);
        assertEquals("John Doe", foundUser.getName());
    }

    @Test
    public void testFindByUserId_NotFound() {
        // When & Then: 잘못된 ID로 조회 시 예외 발생 검증
        assertThrows(IllegalArgumentException.class, () -> userService.findByUserId(999L));
    }

    @Test
    public void testChangePassword_Success() {
        // Given: 테스트용 사용자 데이터 저장
        User user = User.builder()
                .name("John Doe")
                .email("johndoe@uos.ac.kr")
                .nickname("johndoe")
                .password(passwordEncoder.encode("oldpassword"))
                .roles(Role.WANT_JOIN)
                .createdAt(LocalDateTime.now())
                .lastSeen(LocalDateTime.now())
                .build();
        userRepository.save(user);

        // When: 비밀번호 변경
        boolean result = userService.changePassword("johndoe@uos.ac.kr", "John Doe", "newpassword");

        // Then: 결과 검증
        assertTrue(result);
        User updatedUser = userRepository.findByEmail("johndoe@uos.ac.kr").orElseThrow();
        assertTrue(passwordEncoder.matches("newpassword", updatedUser.getPassword()));
    }

    @Test
    public void testChangePassword_InvalidEmailOrName() {
        // Given: 존재하지 않는 사용자 정보
        String invalidEmail = "invalid@uos.ac.kr";
        String invalidName = "Invalid User";

        // When & Then: 비밀번호 변경 실패 시 false 반환
        boolean result = userService.changePassword(invalidEmail, invalidName, "newpassword");
        assertFalse(result);
    }
}
