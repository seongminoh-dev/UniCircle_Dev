package uniCircle.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "admission_form")
@NoArgsConstructor
public class AdmissionForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "form_id")
    private Long formId;

    @ManyToOne
    @JoinColumn(name = "circle_id")
    private Circle circle;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "form_content", nullable = false, length = 65535)    
    private String formContent;

    @Column(name = "admission_date")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Builder
    public AdmissionForm(Long formId, Circle circle, User user, String formContent, LocalDateTime createdAt, Status status) {
        this.formId = formId;
        this.circle = circle;
        this.user = user;
        this.formContent = formContent;
        this.createdAt = createdAt;
        this.status = status;
    }

    public void updateStatus(Status status) {
        this.status = status;
    }

    public void updateContent(String formContent) {
        this.formContent = formContent;
    }
}
