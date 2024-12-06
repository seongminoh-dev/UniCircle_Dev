package uniCircle.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import uniCircle.backend.entity.Comment;
import uniCircle.backend.entity.Visibility;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class CommentDTO {
    private Long commentId;       // 댓글 ID
    private Long postId;            // 게시글 ID
    private Long userId;            // 작성자 ID
    private String content;
    private Visibility visibility;  // 공개 범위
    private LocalDateTime createdAt; // 작성일
    private LocalDateTime updatedAt; // 수정일

    @Builder
    public CommentDTO(Long commentId, Long postId, Long userId, Visibility visibility,
                      LocalDateTime createdAt, LocalDateTime updatedAt, String content) {
        this.commentId = commentId;
        this.postId = postId;
        this.userId = userId;
        this.visibility = visibility;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.content = content;
    }

    public static CommentDTO fromEntity(Comment comment) {
        return CommentDTO.builder()
                .commentId(comment.getCommentId())
                .postId(comment.getPost().getPostId()) // Board 엔티티에서 ID만 가져옴
                .userId(comment.getUser().getUserId()) // User 엔티티에서 ID만 가져옴
                .visibility(comment.getVisibility())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .content(comment.getContent())
                .build();
    }
}
