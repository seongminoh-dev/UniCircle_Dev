package uniCircle.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import uniCircle.backend.entity.Board;
import uniCircle.backend.entity.Visibility;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class BoardDTO {
    private Long postId;          // 게시글 ID
    private Long userId;           // 작성자 ID
    private Long circleId;         // 동아리 ID
    private String title;          // 게시글 제목
    private String content;        // 게시글 내용
    private Visibility visibility; // 공개 범위
    private Long hashtagId;        // 해시태그 ID
    private Boolean isNotice;      // 공지사항 여부
    private LocalDateTime createdAt; // 작성일
    private LocalDateTime updatedAt; // 수정일
    private byte[] image; // 이미지 데이터

    @Builder
    public BoardDTO(Long postId, Long userId, Long circleId, String title, String content, Visibility visibility, Long hashtagId, Boolean isNotice, LocalDateTime createdAt, LocalDateTime updatedAt, byte[] image) {
        this.postId = postId;
        this.userId = userId;
        this.circleId = circleId;
        this.title = title;
        this.content = content;
        this.visibility = visibility;
        this.hashtagId = hashtagId;
        this.isNotice = isNotice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.image = image;
    }

    public static BoardDTO fromEntity(Board board) {
        return BoardDTO.builder()
                .postId(board.getPostId())
                .userId(board.getUser().getUserId()) // User 엔티티에서 ID만 가져옴
                .circleId(board.getCircle().getCircleId()) // Circle 엔티티에서 ID만 가져옴
                .title(board.getTitle())
                .content(board.getContent())
                .visibility(board.getVisibility())
                .hashtagId(board.getHashtag() != null ? board.getHashtag().getHashtagId() : null) // 해시태그 ID 가져옴
                .isNotice(board.getIsNotice())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .image(board.getImage())
                .build();
    }
}
