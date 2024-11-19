package uniCircle.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import uniCircle.backend.entity.CircleHashtag;

@Getter
@NoArgsConstructor
public class CircleHashtagDTO {
    private Long circleHashtagId;
    private CircleDTO circle;
    private HashtagDTO hashtag;

    @Builder
    public CircleHashtagDTO(Long circleHashtagId, CircleDTO circle, HashtagDTO hashtag) {
        this.circleHashtagId = circleHashtagId;
        this.circle = circle;
        this.hashtag = hashtag;
    }

    public static CircleHashtagDTO fromEntity(CircleHashtag circleHashtag) {
        return CircleHashtagDTO.builder()
                .circleHashtagId(circleHashtag.getCircleHashtagId())
                .circle(CircleDTO.fromEntity(circleHashtag.getCircle()))
                .hashtag(HashtagDTO.fromEntity(circleHashtag.getHashtag()))
                .build();
    }
}
