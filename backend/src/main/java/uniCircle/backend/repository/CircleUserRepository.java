package uniCircle.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.entity.CircleUser;
import uniCircle.backend.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface CircleUserRepository extends JpaRepository<CircleUser, Long> {
    List<CircleUser> findByCircle(Circle circle);
    List<CircleUser> findByUser(User user);
    Optional<CircleUser> findByCircleAndUser(Circle circle, User user);
}
