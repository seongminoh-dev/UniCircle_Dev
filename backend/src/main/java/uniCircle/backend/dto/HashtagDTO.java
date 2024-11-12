package uniCircle.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import uniCircle.backend.entity.Hashtag;

@Getter
@NoArgsConstructor
public class HashtagDTO {
    private Long hashtagId;
    private String content;

    @Builder
    public HashtagDTO(Long hashtagId, String content) {
        this.hashtagId = hashtagId;
        this.content = content;
    }

    public static HashtagDTO fromEntity(Hashtag hashtag) {
        return HashtagDTO.builder()
                .hashtagId(hashtag.getHashtagId())
                .content(hashtag.getContent())
                .build();
    }

    public Hashtag toEntity() {
        return Hashtag.builder()
                .hashtagId(this.hashtagId)
                .content(this.content)
                .build();
    }
}