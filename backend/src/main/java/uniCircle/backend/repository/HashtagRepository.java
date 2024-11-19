package uniCircle.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uniCircle.backend.entity.Hashtag;

import java.util.Optional;

@Repository
public interface HashtagRepository extends JpaRepository<Hashtag, Long> {
    Optional<Hashtag> findByHashtagId(Long hashtagId);
    Optional<Hashtag> findByContent(String content);
    Boolean existsByContent(String content);
}
