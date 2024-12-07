package uniCircle.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import uniCircle.backend.dto.AdmissionFormDTO;
import uniCircle.backend.dto.CircleUserDTO;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.entity.AdmissionForm;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.entity.Status;
import uniCircle.backend.entity.User;
import uniCircle.backend.repository.AdmissionFormRepository;
import uniCircle.backend.repository.CircleRepository;
import uniCircle.backend.repository.UserRepository;


@Service
@RequiredArgsConstructor
public class AdmissionFormService {

    private final AdmissionFormRepository admissionFormRepository;
    private final CircleRepository circleRepository;
    private final UserRepository userRepository;
    private final CircleUserService circleUserService;

    @Transactional
    public AdmissionFormDTO createAdmissionForm(AdmissionFormDTO admissionFormDTO) {
        User user = userRepository.findByUserId(admissionFormDTO.getUserId())
                .orElseThrow(() -> new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_USER));
        
        Circle circle = circleRepository.findByCircleId(admissionFormDTO.getCircleId())
                .orElseThrow(() ->  new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_CIRCLE));
        
        if(admissionFormDTO.getFormContent() == null) throw new AdmissionFormCustomException(AdmissionFormErrorCode.BAD_REQUEST_CONTENT);

        AdmissionForm admissionForm = AdmissionForm.builder()
                .circle(circle)
                .user(user)
                .formContent(admissionFormDTO.getFormContent())
                .createdAt(admissionFormDTO.getCreatedAt())
                .status(admissionFormDTO.getStatus())
                .build();
        
        admissionFormRepository.save(admissionForm);
        return AdmissionFormDTO.fromEntity(admissionForm);
    }

    //form_id로 1개 조회
    public AdmissionFormDTO getAdmissionFormById(Long formId) {
        AdmissionForm admissionForm = admissionFormRepository.findById(formId)
                .orElseThrow(() -> new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_FORM));
        return AdmissionFormDTO.fromEntity(admissionForm);
    }

    //user_id로 리스트 전체 조회
    @Transactional
    public List<Map<String, Object>> getAdmissionFormsByUserId(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty()) throw new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_USER);

        return admissionFormRepository.findByUser(user.get()).stream()
                .map(admissionForm -> {
                    Map<String, Object> formMap = new HashMap<>();

                    formMap.put("form", admissionForm);
                    formMap.put("userNickName", user.get().getNickname());

                    return formMap;
                })
                .collect(Collectors.toList());
    }

    //circle_id로 리스트 전체 조회
    @Transactional
    public List<Map<String, Object>> getAdmissionFormsByCircleId(Long circleId) {
        Optional<Circle> circle = circleRepository.findById(circleId);
        if(circle.isEmpty()) throw new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_CIRCLE);

        return admissionFormRepository.findByCircle(circle.get()).stream()
                .map(admissionForm -> {
                    Map<String, Object> formMap = new HashMap<>();

                    User user = admissionForm.getUser();

                    formMap.put("form", AdmissionFormDTO.fromEntity(admissionForm));
                    formMap.put("userNickName", user.getNickname());

                    return formMap;
                })
                .collect(Collectors.toList());
    }

    //AdmissionForm 수정
    //Content와 Status만 수정이 의미있으므로 전체 업데이트 작성하지 않음

    @Transactional
    public AdmissionFormDTO updateAdmissionFormContent(Long formId, String formContent) {
        
        AdmissionForm form = admissionFormRepository.findById(formId)
                .orElseThrow(() -> new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_FORM));

        if(formContent == null) throw new AdmissionFormCustomException(AdmissionFormErrorCode.BAD_REQUEST_CONTENT);

        form.updateContent(formContent);
        return AdmissionFormDTO.fromEntity(form);
    }

    @Transactional
    public AdmissionFormDTO updateAdmissionFormStatus(Long formId, String status) {

        AdmissionForm form = admissionFormRepository.findById(formId)
                .orElseThrow(() -> new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_FORM));

        try { form.updateStatus(Status.valueOf(status)); }
        catch(Exception e) { throw new AdmissionFormCustomException(AdmissionFormErrorCode.BAD_REQUEST_STATUS); }

        form.updateStatus(Status.valueOf(status));
        return AdmissionFormDTO.fromEntity(form);
    }

    @Transactional
    public AdmissionFormDTO acceptAdmissionForm(Long formId) {

        AdmissionForm form = admissionFormRepository.findById(formId)
                .orElseThrow(() -> new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_FORM));

        try {
                CircleUserDTO circleUser = circleUserService.addUserToCircle(form.getCircle().getCircleId(), UserDTO.fromEntity(form.getUser()));
        }
        catch (IllegalArgumentException e) {
                throw new AdmissionFormCustomException(AdmissionFormErrorCode.BAD_REQUEST_FORM);
        }
        form.updateStatus(Status.ACCEPTED);
        return AdmissionFormDTO.fromEntity(form);
    }

    //AdmissionForm 삭제

    @Transactional
    public void deleteAdmissionForm(Long formId) {
        AdmissionForm form = admissionFormRepository.findById(formId)
                .orElseThrow(() -> new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_FORM));
        admissionFormRepository.delete(form);
    }

    @Transactional
    public Map<String, Object> getAdmissionFormsByUserIdAndCircleId(Long userId, Long circleId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Circle circle = circleRepository.findByCircleId(circleId)
                .orElseThrow(() -> new IllegalArgumentException("circle not found"));

        AdmissionForm form = admissionFormRepository.findByUserAndCircle(user, circle)
                .orElseThrow(() -> new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_FORM));

        Map<String, Object> map = new HashMap<>();

        map.put("AdmissionForm", AdmissionFormDTO.fromEntity(form));
        map.put("userNickName", user.getNickname());

        return map;
    }
}