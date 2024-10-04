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
    private String email;
    private Role roles;
    private String password; // 비밀번호는 보통 민감한 정보이므로, 필요에 따라 노출을 제어해야 합니다.
    private LocalDateTime createdAt;
    private LocalDateTime lastSeen;

    @Builder
    public UserDTO(Long userId, String name, String email, Role roles, String password, LocalDateTime createdAt, LocalDateTime lastSeen) {
        this.userId = userId;
        this.name = name;
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
                .email(user.getEmail())
                .roles(user.getRoles())
                .password(user.getPassword()) // 실제 애플리케이션에서는 비밀번호를 DTO에 포함시키는 것에 주의해야 합니다.
                .createdAt(user.getCreatedAt())
                .lastSeen(user.getLastSeen())
                .build();
    }
}