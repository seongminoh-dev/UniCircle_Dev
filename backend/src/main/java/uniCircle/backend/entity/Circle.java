package uniCircle.backend.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Table(name = "circle")
public class Circle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "circle_id")
    private Long circleId;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "admin_user_id")
    private User adminUser; // 각 동아리에는 한명의 관리자만 존재할 수 있음

    @OneToMany(mappedBy = "circle")
    private Set<CircleHashtag> circleHashtags = new HashSet<>();

    @OneToMany(mappedBy = "circle")
    private List<CircleUser> circleUsers;

    @Column(length = 65535)
    private String questions;

    @Lob
    @Column(name = "image")
    private byte[] image; // 이미지 데이터

    @Builder
    public Circle(Long circleId, String name, String description, LocalDateTime createdAt, User adminUser, Set<CircleHashtag> circleHashtags, List<CircleUser> circleUsers, String questions, byte[] image) {
        this.circleId = circleId;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.adminUser = adminUser;
        this.circleHashtags = circleHashtags;
        this.circleUsers = circleUsers;
        this.questions = questions;
        this.image = image;
    }



    public Circle() {

    }
}
