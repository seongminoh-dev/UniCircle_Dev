package uniCircle.backend.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uniCircle.backend.entity.RefreshToken;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Boolean existsByTokenContent(String tokenContent);

    @Transactional
    void deleteByTokenContent(String tokenContent);
}
