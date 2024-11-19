package uniCircle.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uniCircle.backend.entity.*;

import java.util.List;
import java.util.Optional;

@Repository
public interface CircleHashtagRepository extends JpaRepository<CircleHashtag, Long> {
    List<CircleHashtag> findByCircle(Circle circle);
    List<CircleHashtag> findByHashtag(Hashtag hashtag);
    Optional<CircleHashtag> findByCircleAndHashtag(Circle circle, Hashtag hashtag);
}
