package uniCircle.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uniCircle.backend.entity.AdmissionForm;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.entity.Status;
import uniCircle.backend.entity.User;

@Repository
public interface AdmissionFormRepository extends JpaRepository<AdmissionForm, Long> {
    List<AdmissionForm> findByUser(User user);
    List<AdmissionForm> findByCircle(Circle circle);

    Optional<AdmissionForm> findByUserAndCircle(User user, Circle circle);
    Optional<AdmissionForm> findByCircleAndStatus(Circle circle, Status status);
}