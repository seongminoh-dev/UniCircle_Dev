package uniCircle.backend.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "board")
@Getter
@NoArgsConstructor
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId; // 게시글 ID (Primary Key)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 작성자 ID (Users 참조)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "circle_id", nullable = false)
    private Circle circle; // 동아리 ID (Circle 참조)

    @Column(name = "title", nullable = false, length = 255)
    private String title; // 게시글 제목

    @Column(name = "content", nullable = false)
    private String content; // 게시글 내용

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    private Visibility visibility; // 공개 범위 (ENUM)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hashtag_id")
    private Hashtag hashtag; // 해시태그 ID (Hashtag 참조)

    @Column(name = "is_notice", nullable = false)
    private Boolean isNotice; // 공지사항 여부

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 작성일

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 수정일

    @Builder
    public Board(User user, Circle circle, String title, String content, Visibility visibility,
                 Hashtag hashtag, Boolean isNotice, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.user = user;
        this.circle = circle;
        this.title = title;
        this.content = content;
        this.visibility = visibility;
        this.hashtag = hashtag;
        this.isNotice = isNotice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

}