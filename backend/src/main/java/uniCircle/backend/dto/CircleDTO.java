package uniCircle.backend.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import uniCircle.backend.entity.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class CircleDTO {

    private Long circleId;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private UserDTO adminUser;
    private Set<String> hashtags;
    //private List<CircleUser> circleUsers;
    private String questions;

    @Builder
    public CircleDTO(Long circleId, String name, String description, LocalDateTime createdAt, UserDTO adminUser, Set<String> hashtags, List<CircleUser> circleUsers, String questions) {
        this.circleId = circleId;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.adminUser = adminUser;
        this.hashtags = hashtags;
        //this.circleUsers = circleUsers;
        this.questions = questions;
    }

    public static CircleDTO fromEntity(Circle circle) {
        return CircleDTO.builder()
                .circleId(circle.getCircleId())
                .name(circle.getName())
                .description(circle.getDescription())
                .createdAt(circle.getCreatedAt())
                .adminUser(UserDTO.fromEntity(circle.getAdminUser()))
                .hashtags(
                        circle.getCircleHashtags() != null
                                ? circle.getCircleHashtags().stream()
                                .map(circleHashtag -> circleHashtag.getHashtag().getContent())
                                .collect(Collectors.toSet())
                                : Collections.emptySet() // null일 경우 빈 Set 반환
                )
                //.circleUsers(circle.getCircleUsers())
                .questions(circle.getQuestions())
                .build();
    }
}
