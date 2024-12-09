package uniCircle.backend.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@Getter
@NoArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id", nullable = false)
    private Long commentId; // 댓글 ID (Primary Key)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Board post; // 게시글 ID (Board 참조)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 작성자 ID (Users 참조)

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    private Visibility visibility; // 공개 범위 (ENUM)

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 작성일

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 수정일

    @Column(name = "content")
    private String content;

    @Builder
    public Comment(Long commentId, Board post, User user, Visibility visibility,
                   LocalDateTime createdAt, LocalDateTime updatedAt, String content) {
        this.commentId = commentId;
        this.post = post;
        this.user = user;
        this.visibility = visibility;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.content = content;
    }
}