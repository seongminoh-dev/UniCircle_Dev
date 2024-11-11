package uniCircle.backend.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import uniCircle.backend.entity.CircleUser;

@Getter
@NoArgsConstructor
public class CircleUserDTO {

    private Long circleUserId;
    private CircleDTO circle;
    private UserDTO user;

    @Builder
    public CircleUserDTO(Long circleUserId, CircleDTO circle, UserDTO user) {
        this.circleUserId = circleUserId;
        this.circle = circle;
        this.user = user;
    }

    public static CircleUserDTO fromEntity(CircleUser circleUser) {
        return CircleUserDTO.builder()
                .circleUserId(circleUser.getCircleUserId())
                .circle(CircleDTO.fromEntity(circleUser.getCircle()))
                .user(UserDTO.fromEntity(circleUser.getUser()))
                .build();
    }
}
