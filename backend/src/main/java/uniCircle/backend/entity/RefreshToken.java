package uniCircle.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;

@Entity
@Getter
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long refreshTokenId;

    private String email;
    private String tokenContent;
    private String expiration;

    @Builder
    public RefreshToken(Long refreshTokenId, String email, String tokenContent, String expiration) {
        this.refreshTokenId = refreshTokenId;
        this.email = email;
        this.tokenContent = tokenContent;
        this.expiration = expiration;
    }

    public RefreshToken() {
    }
}
