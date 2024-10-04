package uniCircle.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import uniCircle.backend.entity.Role;
import uniCircle.backend.entity.User;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class UserDTO {

    private Long userId;
    private String name;
    private String nickname;
    private String email;
    private Role roles;
    private String password; // 비밀번호는 보통 민감한 정보이므로, 필요에 따라 노출을 제어해야 합니다.
    private LocalDateTime createdAt;
    private LocalDateTime lastSeen;

    @Builder
    public UserDTO(Long userId, String name, String nickname, String email, Role roles, String password, LocalDateTime createdAt, LocalDateTime lastSeen) {
        this.userId = userId;
        this.name = name;
        this.nickname = nickname;
        this.email = email;
        this.roles = roles;
        this.password = password;
        this.createdAt = createdAt;
        this.lastSeen = lastSeen;
    }

    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .roles(user.getRoles())
                .password(user.getPassword()) // 주의할 것
                .createdAt(user.getCreatedAt())
                .lastSeen(user.getLastSeen())
                .build();
    }
}