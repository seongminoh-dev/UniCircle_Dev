package uniCircle.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uniCircle.backend.dto.*;
import uniCircle.backend.entity.*;
import uniCircle.backend.repository.*;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CircleHashtagService {
    private final CircleHashtagRepository circleHashtagRepository;
    private final CircleRepository circleRepository;
    private final HashtagRepository hashtagRepository;
    private final HashtagService hashtagService;

    // 해시태그ID List로 동아리 해시태그 추가
    @Transactional
    public CircleHashtagDTO addHashtagToCircle(String content, Long circleId) {
        Circle circle = circleRepository.findByCircleId(circleId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 동아리입니다."));

        Optional<Hashtag> optionalHashtag = hashtagRepository.findByContent(content);
        Hashtag hashtag;

        // optionalHashtag가 NULL이면 해시태그 생성
        if (optionalHashtag.isEmpty()) {
            HashtagDTO hashtagDTO = HashtagDTO.builder()
                    .content(content)
                    .build();
            hashtag = hashtagService.createHashtag(hashtagDTO).toEntity();
        } else {
            hashtag = optionalHashtag.get();
        }

        circleHashtagRepository.findByCircleAndHashtag(circle, hashtag)
                .ifPresent(m -> {
                    throw new IllegalArgumentException("이미 존재하는 해시태그입니다.");
                });

        CircleHashtag circleHashtag = CircleHashtag.builder()
                .circle(circle)
                .hashtag(hashtag)
                .build();

        CircleHashtag savedCircleHashtag = circleHashtagRepository.save(circleHashtag);

        return CircleHashtagDTO.fromEntity(savedCircleHashtag);
    }

    // 동아리에 여러 해시태그 추가
    @Transactional
    public Set<CircleHashtagDTO> addHashtagsToCircle(List<String> contents, Long circleId) {
        Set<CircleHashtagDTO> circleHashtagDTOs = new HashSet<>();
        for (String content : contents) {
            circleHashtagDTOs.add(addHashtagToCircle(content, circleId));
        }
        return circleHashtagDTOs;
    }

    // 해시태그로 동아리 검색
    @Transactional
    public List<CircleDTO> getCirclesFromHashtag(String content) {
        Hashtag hashtag = hashtagRepository.findByContent(content)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 해시태그입니다."));

        return circleHashtagRepository.findByHashtag(hashtag).stream()
                .map(CircleHashtag::getCircle)
                .map(CircleDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 동아리ID로 해시태그 리스트 반환
    @Transactional
    public List<HashtagDTO> getHashtagsFromCircle(Long circleId) {
        Circle circle = circleRepository.findByCircleId(circleId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 동아리입니다."));

        return circleHashtagRepository.findByCircle(circle).stream()
                .map(CircleHashtag::getHashtag)
                .map(HashtagDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 동아리의 해시태그 삭제
    @Transactional
    public void deleteHashtagOfCircle(String content, Long circleId) {
        Hashtag hashtag = hashtagRepository.findByContent(content)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 해시태그입니다."));

        Circle circle = circleRepository.findByCircleId(circleId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 동아리입니다."));

        CircleHashtag circleHashtag = circleHashtagRepository.findByCircleAndHashtag(circle, hashtag)
                        .orElseThrow(() -> new IllegalArgumentException("해당 동아리에 존재하지 않는 해시태그입니다."));

        circleHashtagRepository.delete(circleHashtag);
    }

    // 동아리 해시태그 업데이트. 있는 해시태그는 그대로 없는건 추가하기
    // 없는 해시태그는 삭제
    @Transactional
    public Set<CircleHashtagDTO> updateHashtagsOfCircle(Set<String> contents, Long circleId) {
        Circle circle = circleRepository.findByCircleId(circleId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 동아리입니다."));

        // 원래 동아리에 속해있던 해시태그의 내용 목록
        List<String> originContents = circleHashtagRepository.findByCircle(circle).stream()
                .map(CircleHashtag::getHashtag)
                .map(Hashtag::getContent)
                .toList();

        // 삭제할 해시태그 (originContents에만 존재하는 경우)
        List<String> toRemove = originContents.stream()
                .filter(content -> !contents.contains(content))
                .toList();

        // 추가할 해시태그 (contents에만 존재하는 경우)
        List<String> toAdd = contents.stream()
                .filter(content -> !originContents.contains(content))
                .toList();

        log.info("Origin Contents: {}", originContents);
        log.info("To Remove: {}", toRemove);
        log.info("To Add: {}", toAdd);

        // 삭제 처리
        toRemove.forEach(content -> deleteHashtagOfCircle(content, circleId));

        // 추가 처리
        return addHashtagsToCircle(toAdd, circleId);

    }

    // String Set 중 해시태그가 없는 것만 만들기
    protected Set<Hashtag> uniqueHashtagFilter(Set<String> contents) {
        Set<String> newHashtags = contents.stream()
                .filter(content -> !hashtagRepository.existsByContent(content))
                .collect(Collectors.toSet());

        newHashtags.stream()
                .map(hashtag -> HashtagDTO.builder()
                        .content(hashtag).build())
                .forEach(hashtagDTO ->
                        hashtagService.createHashtag(hashtagDTO).toEntity());

        Set<Hashtag> hashtags = contents.stream()
                .map(hashtagRepository::findByContent)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());

        return hashtags;
    }
    //

    public Set<CircleHashtag> convertDTOsToEntities(Set<CircleHashtagDTO> circleHashtagDTOs) {
        return circleHashtagDTOs.stream().map(dto -> {
            Circle circle = circleRepository.findById(dto.getCircle().getCircleId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Circle입니다."));

            Hashtag hashtag = hashtagRepository.findByContent(dto.getHashtag().getContent())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Hashtag입니다: " + dto.getHashtag().getContent()));

            return CircleHashtag.builder()
                    .circle(circle)
                    .hashtag(hashtag)
                    .build();
        }).collect(Collectors.toSet());
    }
}
