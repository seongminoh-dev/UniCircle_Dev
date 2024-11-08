package uniCircle.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uniCircle.backend.dto.CircleDTO;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.entity.User;
import uniCircle.backend.repository.CircleRepository;
import uniCircle.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CircleService {

    private final CircleRepository circleRepository;
    private final UserRepository userRepository;

    // 동아리 만들기
    @Transactional
    public CircleDTO createCircle(CircleDTO circleDTO) {
        circleRepository.findByName(circleDTO.getName())
                .ifPresent(m -> {
                    throw new IllegalArgumentException("이미 존재하는 동아리입니다.");
                });

        User adminUser = userRepository.findByUserId(circleDTO.getAdminUser().getUserId())
                .orElseThrow(()-> new IllegalArgumentException("유효하지 않은 사용자입니다."));

        Circle circle = Circle.builder()
                .name(circleDTO.getName())
                .description(circleDTO.getDescription())
                .createdAt(circleDTO.getCreatedAt())
                .adminUser(adminUser)
                .circleHashtags(circleDTO.getCircleHashtags())
                .build();

        Circle savedCircle = circleRepository.save(circle);

        return CircleDTO.fromEntity(savedCircle);
    }

    // 동아리 검색
    @Transactional
    public List<Circle> searchCircle(String keyword) {
        return circleRepository.findByNameContaining(keyword);
    }
}
