package uniCircle.backend.service;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import uniCircle.backend.dto.AdmissionFormDTO;
import uniCircle.backend.dto.CircleUserDTO;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.entity.*;
import uniCircle.backend.repository.AdmissionFormRepository;
import uniCircle.backend.repository.CircleRepository;
import uniCircle.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AdmissionFormServiceTest {

    @Autowired
    private AdmissionFormService admissionFormService;

    @Autowired
    private AdmissionFormRepository admissionFormRepository;

    @Autowired
    private CircleRepository circleRepository;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private CircleUserService circleUserService; // Mock CircleUserService

    private User testUser;
    private Circle testCircle;

    @BeforeEach
    public void setup() {
        testUser = User.builder()
                .name("Test User")
                .email("testuser@uos.ac.kr")
                .nickname("testuser")
                .password("password")
                .roles(Role.SYSTEM_ADMIN)
                .createdAt(LocalDateTime.now())
                .lastSeen(LocalDateTime.now())
                .build();
        userRepository.saveAndFlush(testUser);

        testCircle = Circle.builder()
                .name("Test Circle")
                .description("A test circle")
                .createdAt(LocalDateTime.now())
                .adminUser(testUser) // 관리자 지정 (테스트를 위해)
                .build();
        circleRepository.saveAndFlush(testCircle);

        // CircleUserService Mock 설정
        Mockito.when(circleUserService.addUserToCircle(anyLong(), any(UserDTO.class)))
                .thenReturn(CircleUserDTO.builder().build());
    }

    @Test
    public void testCreateAdmissionForm_Success() {
        AdmissionFormDTO dto = AdmissionFormDTO.builder()
                .circleId(testCircle.getCircleId())
                .userId(testUser.getUserId())
                .formContent("I would like to join this circle.")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build();

        AdmissionFormDTO createdForm = admissionFormService.createAdmissionForm(dto);

        assertNotNull(createdForm.getFormId());
        assertEquals("I would like to join this circle.", createdForm.getFormContent());
        assertEquals(Status.PENDING, createdForm.getStatus());
    }

    @Test
    public void testCreateAdmissionForm_NotFoundUser() {
        AdmissionFormDTO dto = AdmissionFormDTO.builder()
                .circleId(testCircle.getCircleId())
                .userId(9999L) // 존재하지 않는 유저
                .formContent("Content")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build();

        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.createAdmissionForm(dto));
    }

    @Test
    public void testCreateAdmissionForm_NotFoundCircle() {
        AdmissionFormDTO dto = AdmissionFormDTO.builder()
                .circleId(9999L) // 존재하지 않는 동아리
                .userId(testUser.getUserId())
                .formContent("Content")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build();

        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.createAdmissionForm(dto));
    }

    @Test
    public void testCreateAdmissionForm_NullContent() {
        AdmissionFormDTO dto = AdmissionFormDTO.builder()
                .circleId(testCircle.getCircleId())
                .userId(testUser.getUserId())
                .formContent(null) // null content
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build();

        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.createAdmissionForm(dto));
    }

    @Test
    public void testGetAdmissionFormById_Success() {
        AdmissionForm form = admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Joining request")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        AdmissionFormDTO found = admissionFormService.getAdmissionFormById(form.getFormId());
        assertEquals("Joining request", found.getFormContent());
    }

    @Test
    public void testGetAdmissionFormById_NotFound() {
        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.getAdmissionFormById(9999L));
    }

    @Test
    public void testGetAdmissionFormsByUserId_Success() {
        admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Form1")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Form2")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        List<Map<String, Object>> forms = admissionFormService.getAdmissionFormsByUserId(testUser.getUserId());
        assertEquals(2, forms.size());
        assertEquals("testuser", forms.get(0).get("userNickName"));
    }

    @Test
    public void testGetAdmissionFormsByUserId_NotFoundUser() {
        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.getAdmissionFormsByUserId(9999L));
    }

    @Test
    public void testGetAdmissionFormsByCircleId_Success() {
        admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Form for circle")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        List<Map<String, Object>> forms = admissionFormService.getAdmissionFormsByCircleId(testCircle.getCircleId());
        assertEquals(1, forms.size());
        assertEquals("testuser", forms.get(0).get("userNickName"));
    }

    @Test
    public void testGetAdmissionFormsByCircleId_NotFoundCircle() {
        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.getAdmissionFormsByCircleId(9999L));
    }

    @Test
    public void testGetAdmissionFormsByCircleIdAndStatus() {
        admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Form accepted")
                .createdAt(LocalDateTime.now())
                .status(Status.ACCEPTED)
                .build());

        admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Form pending")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        List<Map<String, Object>> acceptedForms = admissionFormService.getAdmissionFormsByCircleIdAndStatus(testCircle.getCircleId(), "ACCEPTED");
        assertEquals(1, acceptedForms.size());
        assertEquals("Form accepted", ((AdmissionFormDTO)acceptedForms.get(0).get("form")).getFormContent());
    }

    @Test
    public void testGetAdmissionFormsByCircleIdAndStatus_NotFoundCircle() {
        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.getAdmissionFormsByCircleIdAndStatus(9999L, "PENDING"));
    }

    @Test
    public void testUpdateAdmissionFormContent_Success() {
        AdmissionForm form = admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Old Content")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        AdmissionFormDTO updated = admissionFormService.updateAdmissionFormContent(form.getFormId(), "New Content");
        assertEquals("New Content", updated.getFormContent());
    }

    @Test
    public void testUpdateAdmissionFormContent_NotFound() {
        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.updateAdmissionFormContent(9999L, "New Content"));
    }

    @Test
    public void testUpdateAdmissionFormContent_NullContent() {
        AdmissionForm form = admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Content")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.updateAdmissionFormContent(form.getFormId(), null));
    }

    @Test
    public void testUpdateAdmissionFormStatus_Success() {
        AdmissionForm form = admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Status change")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        AdmissionFormDTO updated = admissionFormService.updateAdmissionFormStatus(form.getFormId(), "ACCEPTED");
        assertEquals(Status.ACCEPTED, updated.getStatus());
    }

    @Test
    public void testUpdateAdmissionFormStatus_NotFound() {
        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.updateAdmissionFormStatus(9999L, "ACCEPTED"));
    }

    @Test
    public void testUpdateAdmissionFormStatus_BadStatus() {
        AdmissionForm form = admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Status change")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.updateAdmissionFormStatus(form.getFormId(), "INVALID_STATUS"));
    }

    @Test
    public void testAcceptAdmissionForm_Success() {
        AdmissionForm form = admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Accept me")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        AdmissionFormDTO acceptedForm = admissionFormService.acceptAdmissionForm(form.getFormId());
        assertEquals(Status.ACCEPTED, acceptedForm.getStatus());
    }

    @Test
    public void testAcceptAdmissionForm_NotFound() {
        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.acceptAdmissionForm(9999L));
    }

    @Test
    public void testRejectAdmissionForm_Success() {
        AdmissionForm form = admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Reject me")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        AdmissionFormDTO rejectedForm = admissionFormService.rejectAdmissionForm(form.getFormId());
        assertEquals(Status.REJECTED, rejectedForm.getStatus());
    }

    @Test
    public void testRejectAdmissionForm_NotFound() {
        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.rejectAdmissionForm(9999L));
    }

    @Test
    public void testRejectAdmissionForm_AlreadyTaken() {
        AdmissionForm form = admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Already accepted")
                .createdAt(LocalDateTime.now())
                .status(Status.ACCEPTED) // 이미 ACCEPTED 상태
                .build());

        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.rejectAdmissionForm(form.getFormId()));
    }

    @Test
    public void testDeleteAdmissionForm_Success() {
        AdmissionForm form = admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("To delete")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        admissionFormService.deleteAdmissionForm(form.getFormId());

        assertFalse(admissionFormRepository.findById(form.getFormId()).isPresent());
    }

    @Test
    public void testDeleteAdmissionForm_NotFound() {
        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.deleteAdmissionForm(9999L));
    }

    @Test
    public void testGetAdmissionFormsByUserIdAndCircleId_Success() {
        AdmissionForm form = admissionFormRepository.save(AdmissionForm.builder()
                .circle(testCircle)
                .user(testUser)
                .formContent("Specific form")
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build());

        Map<String, Object> result = admissionFormService.getAdmissionFormsByUserIdAndCircleId(testUser.getUserId(), testCircle.getCircleId());
        assertNotNull(result.get("AdmissionForm"));
        assertEquals("testuser", result.get("userNickName"));
    }

    @Test
    public void testGetAdmissionFormsByUserIdAndCircleId_NotFoundUser() {
        assertThrows(IllegalArgumentException.class, () -> admissionFormService.getAdmissionFormsByUserIdAndCircleId(9999L, testCircle.getCircleId()));
    }

    @Test
    public void testGetAdmissionFormsByUserIdAndCircleId_NotFoundCircle() {
        assertThrows(IllegalArgumentException.class, () -> admissionFormService.getAdmissionFormsByUserIdAndCircleId(testUser.getUserId(), 9999L));
    }

    @Test
    public void testGetAdmissionFormsByUserIdAndCircleId_NotFoundForm() {
        assertThrows(AdmissionFormCustomException.class, () -> admissionFormService.getAdmissionFormsByUserIdAndCircleId(testUser.getUserId(), testCircle.getCircleId()));
    }
}
