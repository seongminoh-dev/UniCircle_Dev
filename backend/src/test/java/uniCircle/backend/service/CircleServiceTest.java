package uniCircle.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import uniCircle.backend.dto.CircleDTO;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.entity.Hashtag;
import uniCircle.backend.entity.Role;
import uniCircle.backend.repository.CircleRepository;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class CircleServiceTest {
    @Autowired
    private CircleService circleService;

    @Autowired
    private CircleRepository circleRepository;

    @Autowired
    private UserService userService;

    @Test
    public void testCreateCircle() {
        // Given:
        UserDTO userDTO = UserDTO.builder()
                .name("John Doe")
                .email("johndoe@uos.ac.kr")
                .nickname("johndoe")
                .password("securepassword")
                .roles(Role.WANT_JOIN)
                .build();
        UserDTO adminUser = userService.registerUser(userDTO);
        Set<String> hashtags = new HashSet<>();
        hashtags.add("hello");
        hashtags.add("world");
        CircleDTO circleDTO = CircleDTO.builder()
                .name("circle Name")
                .description("circle description")
                .adminUser(adminUser)
                .createdAt(LocalDateTime.now())
                .hashtags(hashtags)
                .questions("circle.question" +
                        "{" +
                        "\"questions\" :" +
                        "[" +
                        "\"question1\"," +
                        "\"question2\"," +
                        "\"question3\"" +
                        "]" +
                        "}")
                .build();

        // When:
        CircleDTO createdCircle = circleService.createCircle(circleDTO);

        // Then:
        assertNotNull(createdCircle);
        assertEquals(createdCircle.getName(), circleDTO.getName());
        assertEquals(createdCircle.getDescription(), circleDTO.getDescription());
        assertEquals(createdCircle.getAdminUser().getEmail(), adminUser.getEmail());
        assertEquals(createdCircle.getQuestions(), circleDTO.getQuestions());


        Optional<Circle> savedCircle = circleRepository.findByName(createdCircle.getName());
        assertTrue(savedCircle.isPresent());
        assertEquals(savedCircle.get().getDescription(), circleDTO.getDescription());
        assertEquals(savedCircle.get().getAdminUser().getEmail(), adminUser.getEmail());
        System.out.print(savedCircle.get().getCircleHashtags());
    }
}
