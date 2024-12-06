package uniCircle.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;
import uniCircle.backend.entity.Visibility;

@Getter
@Setter
@NoArgsConstructor
public class BoardRequest {

    @Schema(
            name = "userId",
            description = "작성자 ID",
            type = "Long",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "1")
    private Long userId;

    @Schema(
            name = "circleId",
            description = "동아리 ID",
            type = "Long",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "2")
    private Long circleId;

    @Schema(
            name = "title",
            description = "게시글 제목",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "모집 공고")
    private String title;

    @Schema(
            name = "content",
            description = "게시글 내용",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "동아리 신입 회원을 모집합니다.")
    private String content;

    @Schema(
            name = "visibility",
            description = "공개 범위",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "PUBLIC")
    private Visibility visibility;

    @Schema(
            name = "hashtagId",
            description = "해시태그 ID",
            type = "Long",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED,
            example = "3")
    private Long hashtagId;

    @Schema(
            name = "isNotice",
            description = "공지사항 여부",
            type = "Boolean",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "true")
    private Boolean isNotice;

    @Schema(
            name = "file",
            description = "이미지 파일",
            type = "file",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    private MultipartFile file; // 이미지 파일 추가
}
