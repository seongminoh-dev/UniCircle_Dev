package uniCircle.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uniCircle.backend.entity.AdmissionForm;

@Repository
public interface AdmissionFormRepository extends JpaRepository<AdmissionForm, Long> {
    Optional<AdmissionForm> findByUserId(Long userId);
    Optional<AdmissionForm> findByCircleId(Long circleId);
}