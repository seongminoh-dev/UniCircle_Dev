package uniCircle.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uniCircle.backend.dto.CircleDTO;
import uniCircle.backend.dto.CircleUserDTO;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.entity.CircleUser;
import uniCircle.backend.entity.User;
import uniCircle.backend.repository.CircleRepository;
import uniCircle.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CircleService {

    private final CircleRepository circleRepository;
    private final UserRepository userRepository;
    private final CircleUserService circleUserService;

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
                //.circleHashtags(circleDTO.getCircleHashtags())
                .build();

        Circle savedCircle = circleRepository.save(circle);

        circleUserService.addUserToCircle(savedCircle.getCircleId(), circleDTO.getAdminUser());

        return CircleDTO.fromEntity(savedCircle);
    }

    @Transactional
    public CircleDTO updateCircle(CircleDTO circleDTO) {
        // circle
        Circle originCircle = circleRepository.findByCircleId(circleDTO.getCircleId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 동아리입니다."));

        // 유저 확인
        User adminUser = userRepository.findByUserId(circleDTO.getAdminUser().getUserId())
                .orElseThrow(()-> new IllegalArgumentException("유효하지 않은 사용자입니다."));

        // 동아리 정보 업데이트
        Circle updatedCircle = Circle.builder()
                .circleId(originCircle.getCircleId())
                .name(circleDTO.getName())
                .description(circleDTO.getDescription())
                .createdAt(originCircle.getCreatedAt())
                .adminUser(adminUser)
                //.circleHashtags(circleDTO.getCircleHashtags())
                .questions(circleDTO.getQuestions())
                .build();

        return CircleDTO.fromEntity(circleRepository.save(updatedCircle));
    }

    @Transactional
    public void deleteCircle(Long id) {
        // 동아리 확인
        Circle circle = circleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 동아리입니다."));

        // 동아리 삭제
        circleRepository.delete(circle);
    }

    // 동아리 검색
    @Transactional
    public List<CircleDTO> searchCircles(String keyword) {
        List<Circle> circles = circleRepository.findByNameContaining(keyword);
        return circles.stream()
                .map(CircleDTO::fromEntity)  // Circle을 CircleDTO로 변환
                .collect(Collectors.toList());  // List<CircleDTO>로 반환
    }

    // 해당 ID 동아리
    @Transactional
    public CircleDTO getCircle(Long id) {
        Optional<Circle> circle = circleRepository.findById(id);

        return circle.map(CircleDTO::fromEntity).orElse(null);
    }



}
