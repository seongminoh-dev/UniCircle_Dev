package uniCircle.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uniCircle.backend.dto.CircleDTO;
import uniCircle.backend.dto.CircleHashtagDTO;
import uniCircle.backend.dto.HashtagDTO;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.entity.CircleHashtag;
import uniCircle.backend.entity.Hashtag;
import uniCircle.backend.entity.User;
import uniCircle.backend.repository.CircleHashtagRepository;
import uniCircle.backend.repository.CircleRepository;
import uniCircle.backend.repository.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CircleService {

    private final CircleRepository circleRepository;
    private final UserRepository userRepository;
    private final CircleUserService circleUserService;
    private final CircleHashtagService circleHashtagService;
    private final CircleHashtagRepository circleHashtagRepository;

    // 동아리 만들기
    @Transactional
    public CircleDTO createCircle(CircleDTO circleDTO) {
        circleRepository.findByName(circleDTO.getName())
                .ifPresent(m -> {
                    throw new IllegalArgumentException("이미 존재하는 동아리입니다.");
                });

        User adminUser = userRepository.findByUserId(circleDTO.getAdminUser().getUserId())
                .orElseThrow(()-> new IllegalArgumentException("유효하지 않은 사용자입니다."));

        Set<String> hashtagContents = circleDTO.getHashtags();
        Set<Hashtag> hashtags = circleHashtagService.uniqueHashtagFilter(hashtagContents);
        Set<CircleHashtagDTO> circleHashtagDTOs = hashtags.stream()
                .map(hashtag -> CircleHashtagDTO.builder()
                        .circle(circleDTO)
                        .hashtag(HashtagDTO.fromEntity(hashtag))
                        .build()).collect(Collectors.toSet());
//        Set<CircleHashtag> circleHashtags = circleHashtagService.convertDTOsToEntities(circleHashtagDTOs);

        Circle circle = Circle.builder()
                .name(circleDTO.getName())
                .description(circleDTO.getDescription())
                .createdAt(circleDTO.getCreatedAt())
                .adminUser(adminUser)
//                .circleHashtags(circleHashtags)
                .questions(circleDTO.getQuestions())
                .build();

        // repository에 circle 저장
        Circle savedCircle = circleRepository.save(circle);

        Long circleId = savedCircle.getCircleId();

        circleHashtagService.updateHashtagsOfCircle(hashtagContents, circleId);
        circleUserService.addUserToCircle(circleId, circleDTO.getAdminUser());


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

        Long circleId = originCircle.getCircleId();

        Set<String> hashtags = circleDTO.getHashtags();
        Set<CircleHashtagDTO> circleHashtagDTOs = circleHashtagService.updateHashtagsOfCircle(hashtags, circleId);
        Set<CircleHashtag> circleHashtags = circleHashtagService.convertDTOsToEntities(circleHashtagDTOs);


        // 동아리 정보 업데이트
        Circle updatedCircle = Circle.builder()
                .circleId(circleId)
                .name(circleDTO.getName())
                .description(circleDTO.getDescription())
                .createdAt(originCircle.getCreatedAt())
                .adminUser(adminUser)
//                .circleHashtags(circleHashtags)
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
