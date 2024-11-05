package uniCircle.backend.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.entity.CircleHashtag;
import uniCircle.backend.entity.CircleUser;
import uniCircle.backend.entity.User;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class CircleDTO {

    private long circleId;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private User adminUser;
    private List<CircleHashtag> circleHashtags;
    private List<CircleUser> circleUsers;

    @Builder
    public CircleDTO(long circleId, String name, String description, LocalDateTime createdAt, User adminUser, List<CircleHashtag> circleHashtags, List<CircleUser> circleUsers) {
        this.circleId = circleId;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.adminUser = adminUser;
        this.circleHashtags = circleHashtags;
        this.circleUsers = circleUsers;
    }

    public static CircleDTO fromEntity(Circle circle) {
        return CircleDTO.builder()
                .circleId(circle.getCircleId())
                .name(circle.getName())
                .description(circle.getDescription())
                .createdAt(circle.getCreatedAt())
                .adminUser(circle.getAdminUser())
                .circleHashtags(circle.getCircleHashtags())
                .circleUsers(circle.getCircleUsers())
                .build();
    }
}
