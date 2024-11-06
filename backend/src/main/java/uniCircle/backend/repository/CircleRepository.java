package uniCircle.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uniCircle.backend.dto.CircleDTO;
import uniCircle.backend.entity.Circle;

import java.util.List;
import java.util.Optional;

@Repository
public interface CircleRepository extends JpaRepository<Circle, Long> {
    Optional<Circle> findByName(String name);
    Optional<Circle> findByCircleId(Long circleId);

    List<Circle> findByNameContaining(String name);
}
