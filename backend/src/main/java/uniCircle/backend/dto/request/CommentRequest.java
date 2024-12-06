package uniCircle.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uniCircle.backend.entity.Visibility;

@Getter
@Setter
@NoArgsConstructor
public class CommentRequest {

    @Schema(
            name = "postId",
            description = "댓글이 달릴 게시글 ID",
            type = "Long",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "1"
    )
    private Long postId;

    @Schema(
            name = "userId",
            description = "댓글 작성자 ID",
            type = "Long",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "1"
    )
    private Long userId;

    @Schema(
            name = "visibility",
            description = "댓글 공개 범위",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "PUBLIC"
    )
    private Visibility visibility;

    @Schema(
            name = "content",
            description = "댓글 내용",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "이 게시글에 대해 궁금한 점이 있습니다."
    )
    private String content;
}
