package uniCircle.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import uniCircle.backend.dto.AdmissionFormDTO;
import uniCircle.backend.dto.CircleDTO;
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

    @Transactional
    public AdmissionFormDTO createAdmissionForm(AdmissionFormDTO admissionFormDTO) {
        User user = userRepository.findByUserId(admissionFormDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + admissionFormDTO.getUserId()));
        
        Circle circle = circleRepository.findByCircleId(admissionFormDTO.getCircleId())
                .orElseThrow(() -> new RuntimeException("Circle not found with ID: " + admissionFormDTO.getCircleId()));
        
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
                .orElseThrow(() -> new RuntimeException("AdmissionForm not found with ID: " + formId));
        return AdmissionFormDTO.fromEntity(admissionForm);
    }

    //user_id로 리스트 전체 조회
    public List<AdmissionFormDTO> getAdmissionFormsByUser(UserDTO userDTO) {
        return admissionFormRepository.findByUserId(userDTO.getUserId()).stream()
                .map(AdmissionFormDTO::fromEntity)
                .collect(Collectors.toList());
    }

    //circle_id로 리스트 전체 조회
    public List<AdmissionFormDTO> getAdmissionFormsByCircle(CircleDTO circleDTO) {
        return admissionFormRepository.findByCircleId(circleDTO.getCircleId()).stream()
                .map(AdmissionFormDTO::fromEntity)
                .collect(Collectors.toList());
    }

    //AdmissionForm 전체 수정
    @Transactional
    public AdmissionFormDTO updateAdmissionForm(Long formId, AdmissionFormDTO admissionFormDTO) {
        AdmissionForm existingForm = admissionFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("AdmissionForm not found with ID: " + formId));

        Circle circle = circleRepository.findById(admissionFormDTO.getCircleId())
                .orElseThrow(() -> new RuntimeException("Circle not found with ID: " + admissionFormDTO.getCircleId()));
        

        User user = userRepository.findById(admissionFormDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + admissionFormDTO.getUserId()));

        
        AdmissionForm updatedForm = AdmissionForm.builder()
                .circle(circle)
                .user(user)
                .formContent(admissionFormDTO.getFormContent())
                .createdAt(existingForm.getCreatedAt())
                .status(admissionFormDTO.getStatus())
                .build();

        admissionFormRepository.delete(existingForm);
        admissionFormRepository.save(updatedForm);

        return AdmissionFormDTO.fromEntity(updatedForm);
    }

    //status만 변경할 경우 사용
    //테이블이 크면 mapper나 query로 쓰는게 맞음
    @Transactional
    public AdmissionFormDTO updateAdmissionFormStatus(Long formId, Status status) {
        AdmissionForm existingForm = admissionFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("AdmissionForm not found with ID: " + formId));

        AdmissionForm updatedForm = AdmissionForm.builder()
                .circle(existingForm.getCircle())
                .user(existingForm.getUser())
                .formContent(existingForm.getFormContent())
                .createdAt(existingForm.getCreatedAt())
                .status(status)
                .build();

        admissionFormRepository.delete(existingForm);
        admissionFormRepository.save(updatedForm);

        return AdmissionFormDTO.fromEntity(updatedForm);
    }

    @Transactional
    public void deleteAdmissionForm(Long formId) {
        AdmissionForm form = admissionFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("AdmissionForm not found with ID: " + formId));
        admissionFormRepository.delete(form);
    }
}