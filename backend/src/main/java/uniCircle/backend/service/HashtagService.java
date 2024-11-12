package uniCircle.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uniCircle.backend.dto.HashtagDTO;
import uniCircle.backend.entity.Hashtag;
import uniCircle.backend.repository.HashtagRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HashtagService {

    private final HashtagRepository hashtagRepository;

    public HashtagDTO createHashtag(HashtagDTO hashtagDTO) {
        Hashtag hashtag = hashtagDTO.toEntity();
        Hashtag savedHashtag = hashtagRepository.save(hashtag);
        return HashtagDTO.fromEntity(savedHashtag);
    }

    public HashtagDTO getHashtagById(Long hashtagId) {
        Hashtag hashtag = hashtagRepository.findById(hashtagId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid hashtag ID"));
        return HashtagDTO.fromEntity(hashtag);
    }

    public List<HashtagDTO> getAllHashtags() {
        return hashtagRepository.findAll().stream()
                .map(HashtagDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
