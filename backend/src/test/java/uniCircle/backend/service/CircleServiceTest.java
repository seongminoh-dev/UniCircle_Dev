package uniCircle.backend.service;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import uniCircle.backend.dto.CircleDTO;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.entity.Role;
import uniCircle.backend.entity.User;
import uniCircle.backend.repository.CircleRepository;
import uniCircle.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class CircleServiceTest {

    @Autowired
    private CircleService circleService;

    @Autowired
    private CircleRepository circleRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testCreateCircle_Success() {
        // Given: 테스트용 사용자 생성
        User adminUser = User.builder()
                .name("Admin User")
                .email("admin@uos.ac.kr")
                .nickname("admin")
                .password("securepassword")
                .roles(Role.SYSTEM_ADMIN)
                .createdAt(LocalDateTime.now())
                .lastSeen(LocalDateTime.now())
                .build();
        userRepository.save(adminUser);

        // Given: 테스트용 CircleDTO 생성
        CircleDTO circleDTO = CircleDTO.builder()
                .name("Circle Name")
                .description("Test Circle Description")
                .createdAt(LocalDateTime.now())
                .adminUser(UserDTO.fromEntity(adminUser)) // Admin User 설정
                .hashtags(Set.of("test", "community")) // Hashtags 설정
                .build();

        // When: 동아리 생성 메서드 호출
        CircleDTO createdCircle = circleService.createCircle(circleDTO);

        // Then: 결과 검증
        assertNotNull(createdCircle);
        assertEquals("Circle Name", createdCircle.getName());
        assertEquals("Test Circle Description", createdCircle.getDescription());
        assertNotNull(createdCircle.getAdminUser());
    }

    @Test
    public void testCreateCircle_DuplicateName() {
        // Given: 이미 존재하는 동아리 생성
        Circle existingCircle = Circle.builder()
                .name("Existing Circle")
                .description("Description")
                .createdAt(LocalDateTime.now())
                .build();
        circleRepository.save(existingCircle);

        CircleDTO duplicateCircleDTO = CircleDTO.builder()
                .name("Existing Circle")
                .description("Duplicate Circle")
                .createdAt(LocalDateTime.now())
                .build();

        // When & Then: 예외 발생 검증
        assertThrows(IllegalArgumentException.class, () -> circleService.createCircle(duplicateCircleDTO));
    }

    @Test
    public void testUpdateCircle_Success() {
        // Given: 먼저 adminUser를 생성하고 저장
        User adminUser = userRepository.saveAndFlush(User.builder()
                .name("Admin User")
                .email("admin@uos.ac.kr")
                .nickname("admin")
                .password("securepassword")
                .roles(Role.SYSTEM_ADMIN)
                .createdAt(LocalDateTime.now())
                .lastSeen(LocalDateTime.now())
                .build());

        // 기존 동아리 생성 시 adminUser 할당
        Circle existingCircle = Circle.builder()
                .name("Circle Name")
                .description("Description")
                .createdAt(LocalDateTime.now())
                .adminUser(adminUser) // 여기서 adminUser 지정
                .build();
        circleRepository.save(existingCircle);

        // 업데이트 DTO 생성 시에도 adminUser 지정
        CircleDTO updateDTO = CircleDTO.builder()
                .circleId(existingCircle.getCircleId())
                .name("Updated Circle Name")
                .description("Updated Description")
                .adminUser(UserDTO.fromEntity(adminUser)) // adminUser 반드시 설정
                .hashtags(Set.of()) // 필요하다면 빈 Set로라도 초기화
                .build();

        // When: 동아리 업데이트
        CircleDTO updatedCircle = circleService.updateCircle(updateDTO);

        // Then: 결과 검증
        assertNotNull(updatedCircle);
        assertEquals("Updated Circle Name", updatedCircle.getName());
        assertEquals("Updated Description", updatedCircle.getDescription());
    }
    @Test
    public void testUpdateCircle_NotFound() {
        // Given: 존재하지 않는 동아리 데이터
        CircleDTO updateDTO = CircleDTO.builder()
                .circleId(999L)
                .name("Nonexistent Circle")
                .description("Description")
                .build();

        // When & Then: 예외 발생 검증
        assertThrows(IllegalArgumentException.class, () -> circleService.updateCircle(updateDTO));
    }

    @Test
    public void testDeleteCircle_Success() {
        // Given: 테스트용 동아리 생성
        Circle circle = Circle.builder()
                .name("Circle To Delete")
                .description("Description")
                .createdAt(LocalDateTime.now())
                .build();
        circleRepository.save(circle);

        Long circleId = circle.getCircleId();

        // When: 동아리 삭제 메서드 호출
        circleService.deleteCircle(circleId);

        // Then: 결과 검증
        Optional<Circle> deletedCircle = circleRepository.findById(circleId);
        assertFalse(deletedCircle.isPresent());
    }

    @Test
    public void testDeleteCircle_NotFound() {
        // When & Then: 존재하지 않는 동아리 삭제 시 예외 발생
        assertThrows(IllegalArgumentException.class, () -> circleService.deleteCircle(999L));
    }

    @Test
    public void testSearchCircles_Success() {
        User adminUser = userRepository.saveAndFlush(User.builder()
                .name("Admin User")
                .email("admin@uos.ac.kr")
                .nickname("admin")
                .password("securepassword")
                .roles(Role.SYSTEM_ADMIN)
                .createdAt(LocalDateTime.now())
                .lastSeen(LocalDateTime.now())
                .build());


        // Given: 테스트용 동아리 생성
        Circle circle1 = Circle.builder()
                .name("Circle Name")
                .description("Description")
                .createdAt(LocalDateTime.now())
                .adminUser(adminUser) // 여기서 adminUser 지정
                .build();

        Circle circle2 = Circle.builder()
                .name("Circle Name2")
                .description("Description")
                .createdAt(LocalDateTime.now())
                .adminUser(adminUser) // 여기서 adminUser 지정
                .build();

        circleRepository.save(circle1);
        circleRepository.save(circle2);

        // When: 검색 메서드 호출
        List<CircleDTO> results = circleService.searchCircles("Name");

        // Then: 결과 검증
        assertEquals(2, results.size());
    }

    @Test
    public void testGetCircle_Success() {
        // Given: 테스트용 동아리 생성
        User adminUser = userRepository.saveAndFlush(User.builder()
                .name("Admin User")
                .email("admin@uos.ac.kr")
                .nickname("admin")
                .password("securepassword")
                .roles(Role.SYSTEM_ADMIN)
                .createdAt(LocalDateTime.now())
                .lastSeen(LocalDateTime.now())
                .build());

        Circle circle = Circle.builder()
                .name("Circle Name")
                .description("Description")
                .createdAt(LocalDateTime.now())
                .adminUser(adminUser) // 여기서 adminUser 지정
                .build();

        circleRepository.save(circle);

        // When: ID로 동아리 조회
        CircleDTO foundCircle = circleService.getCircle(circle.getCircleId());

        // Then: 결과 검증
        assertNotNull(foundCircle);
        assertEquals("Circle Name", foundCircle.getName());
    }

    @Test
    public void testGetCircle_NotFound() {
        // When & Then: 존재하지 않는 동아리 조회 시 null 반환
        CircleDTO foundCircle = circleService.getCircle(999L);
        assertNull(foundCircle);
    }

    @Test
    public void testGetCircles() {
        User adminUser = userRepository.saveAndFlush(User.builder()
                .name("Admin User")
                .email("admin@uos.ac.kr")
                .nickname("admin")
                .password("securepassword")
                .roles(Role.SYSTEM_ADMIN)
                .createdAt(LocalDateTime.now())
                .lastSeen(LocalDateTime.now())
                .build());


        // Given: 테스트용 동아리 생성
        Circle circle1 = Circle.builder()
                .name("Circle Name")
                .description("Description")
                .createdAt(LocalDateTime.now())
                .adminUser(adminUser) // 여기서 adminUser 지정
                .build();

        Circle circle2 = Circle.builder()
                .name("Circle Name2")
                .description("Description")
                .createdAt(LocalDateTime.now())
                .adminUser(adminUser) // 여기서 adminUser 지정
                .build();

        circleRepository.save(circle1);
        circleRepository.save(circle2);

        // When: 모든 동아리 조회
        List<CircleDTO> circles = circleService.getCircles();

        // Then: 결과 검증
        assertEquals(2, circles.size());
    }
}
