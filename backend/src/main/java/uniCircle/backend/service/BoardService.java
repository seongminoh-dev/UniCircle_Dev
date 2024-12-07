package uniCircle.backend.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uniCircle.backend.dto.BoardDTO;
import uniCircle.backend.entity.Board;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.entity.Hashtag;
import uniCircle.backend.entity.User;
import uniCircle.backend.repository.BoardRepository;
import uniCircle.backend.repository.CircleRepository;
import uniCircle.backend.repository.HashtagRepository;
import uniCircle.backend.repository.UserRepository;

import java.lang.reflect.Array;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final CircleRepository circleRepository;
    private final HashtagRepository hashtagRepository;

    @Transactional
    public BoardDTO createBoard(BoardDTO boardDTO) {
        User user = userRepository.findByUserId(boardDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + boardDTO.getUserId()));

        Circle circle = circleRepository.findByCircleId(boardDTO.getCircleId())
                .orElseThrow(() -> new RuntimeException("Circle not found with ID: " + boardDTO.getCircleId()));

        Hashtag hashtag = null;
        if(boardDTO.getHashtagId() != null){
            hashtag = hashtagRepository.findByHashtagId(boardDTO.getHashtagId())
                    .orElseThrow(() -> new RuntimeException("Hashtag not found with ID: " + boardDTO.getHashtagId()));
        }

        Board board = Board.builder()
                .user(user)
                .circle(circle)
                .title(boardDTO.getTitle())
                .content(boardDTO.getContent())
                .visibility(boardDTO.getVisibility())
                .hashtag(hashtag)
                .isNotice(boardDTO.getIsNotice())
                .createdAt(boardDTO.getCreatedAt())
                .updatedAt(boardDTO.getUpdatedAt())
                .image(boardDTO.getImage())
                .build();

        boardRepository.save(board);
        return BoardDTO.fromEntity(board);
    }

    // 게시글 조회 (ID로 단일 조회)
    @Transactional
    public BoardDTO getBoardById(Long postId) {
        Board board = boardRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Board not found with ID: " + postId));
        return BoardDTO.fromEntity(board);
    }

    @Transactional
    public List<Map<String, Object>> getAllBoardByCircleId(Long circleId) {
        Circle circle = circleRepository.findById(circleId)
                .orElseThrow(() -> new RuntimeException("Circle not found with ID: " + circleId));

        List<Board> boards = boardRepository.findAllByCircle(circle);

        return boards.stream()
                .map(board -> {
                    Map<String, Object> result = new HashMap<>();

                    // BoardDTO 생성
                    BoardDTO boardDTO = BoardDTO.fromEntity(board);
                    result.put("board", boardDTO);

                    // userNickName과 circleName 추가
                    result.put("userNickName", board.getUser().getNickname());
                    result.put("circleName", circle.getName());

                    return result;
                })
                .collect(Collectors.toList());
    }


    // 모든 게시글 조회
    @Transactional
    public List<Map<String, Object>> getAllPosts() {
        return boardRepository.findAll().stream()
                .map(board -> {
                    Map<String, Object> result = new HashMap<>();

                    // BoardDTO 생성
                    BoardDTO boardDTO = BoardDTO.fromEntity(board);
                    result.put("board", boardDTO);

                    // userNickName과 circleName 추가
                    result.put("userNickName", board.getUser().getNickname());
                    result.put("circleName", board.getCircle().getName());

                    return result;
                })
                .collect(Collectors.toList());
    }


    // 게시글 업데이트
    @Transactional
    public BoardDTO updateBoard(Long postId, BoardDTO boardDTO) {
        Board existingBoard = boardRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Board not found with ID: " + postId));

        User user = userRepository.findById(boardDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + boardDTO.getUserId()));

        Circle circle = circleRepository.findById(boardDTO.getCircleId())
                .orElseThrow(() -> new RuntimeException("Circle not found with ID: " + boardDTO.getCircleId()));


        Board updatedBoard = Board.builder()
                .user(user)
                .circle(circle)
                .title(boardDTO.getTitle())
                .content(boardDTO.getContent())
                .visibility(boardDTO.getVisibility())
                .hashtag(existingBoard.getHashtag()) // 기존 해시태그 유지
                .isNotice(boardDTO.getIsNotice())
                .createdAt(existingBoard.getCreatedAt()) // 기존 생성일 유지
                .updatedAt(LocalDateTime.now()) // 수정일 갱신
                .image(boardDTO.getImage())
                .build();

        // 기존 엔티티 삭제 후 새로운 엔티티 저장 (JPA에서 merge 가능)
        boardRepository.delete(existingBoard);
        boardRepository.save(updatedBoard);

        return BoardDTO.fromEntity(updatedBoard);
    }

    // 게시글 삭제
    @Transactional
    public void deleteBoard(Long postId) {
        Board board = boardRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Board not found with ID: " + postId));
        boardRepository.delete(board);
    }
}
