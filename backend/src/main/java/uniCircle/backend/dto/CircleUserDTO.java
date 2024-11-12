package uniCircle.backend.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import uniCircle.backend.entity.CircleUser;

@Getter
@NoArgsConstructor
public class CircleUserDTO {

    private Long circleUserId;
    private CircleDTO circleDTO;
    private UserDTO userDTO;

    @Builder
    public CircleUserDTO(Long circleUserId, CircleDTO circleDTO, UserDTO userDTO) {
        this.circleUserId = circleUserId;
        this.circleDTO = circleDTO;
        this.userDTO = userDTO;
    }

    public static CircleUserDTO fromEntity(CircleUser circleUser) {
        return CircleUserDTO.builder()
                .circleUserId(circleUser.getCircleUserId())
                .circleDTO(CircleDTO.fromEntity(circleUser.getCircle()))
                .userDTO(UserDTO.fromEntity(circleUser.getUser()))
                .build();
    }
}
