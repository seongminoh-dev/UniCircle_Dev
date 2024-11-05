package uniCircle.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import uniCircle.backend.entity.AdmissionForm;
import uniCircle.backend.entity.Status;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class AdmissionFormDTO {
    private Long formId;
    private Long circleId;
    private Long userId;
    private String formContent;
    private LocalDateTime createdAt;
    private Status status;

    @Builder
    public AdmissionFormDTO(Long formId, Long circleId, Long userId, String formContent, LocalDateTime createdAt, Status status) {
        this.formId = formId;
        this.circleId = circleId;
        this.userId = userId;
        this.formContent = formContent;
        this.createdAt = createdAt;
        this.status = status;
    }
}
