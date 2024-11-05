package uniCircle.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Builder;

import java.time.LocalDateTime;

/*
    AdmissionForm.java

    Using table: admission_form
    enum Status is declared in Status.java

    
*/

@Entity
@Getter
@Table(name = "admission_form")
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

    @Column(name = "form_content")
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

    public AdmissionForm() {

    }
}
