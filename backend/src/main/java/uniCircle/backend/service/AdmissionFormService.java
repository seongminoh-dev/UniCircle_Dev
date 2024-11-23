package uniCircle.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import uniCircle.backend.dto.AdmissionFormDTO;
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
    public List<AdmissionFormDTO> getAdmissionFormsByUserId(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty()) throw new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_USER);

        return admissionFormRepository.findByUser(user.get()).stream()
                .map(AdmissionFormDTO::fromEntity)
                .collect(Collectors.toList());
    }

    //circle_id로 리스트 전체 조회
    public List<AdmissionFormDTO> getAdmissionFormsByCircleId(Long circleId) {
        Optional<Circle> circle = circleRepository.findById(circleId);
        if(circle.isEmpty()) throw new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_CIRCLE);

        return admissionFormRepository.findByCircle(circle.get()).stream()
                .map(AdmissionFormDTO::fromEntity)
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

    //AdmissionForm 삭제

    @Transactional
    public void deleteAdmissionForm(Long formId) {
        AdmissionForm form = admissionFormRepository.findById(formId)
                .orElseThrow(() -> new AdmissionFormCustomException(AdmissionFormErrorCode.NOT_FOUND_FORM));
        admissionFormRepository.delete(form);
    }
}