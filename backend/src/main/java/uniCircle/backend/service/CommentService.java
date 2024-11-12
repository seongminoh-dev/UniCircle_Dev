package uniCircle.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uniCircle.backend.dto.CommentDTO;
import uniCircle.backend.entity.Board;
import uniCircle.backend.entity.Comment;
import uniCircle.backend.entity.User;
import uniCircle.backend.entity.Visibility;
import uniCircle.backend.repository.BoardRepository;
import uniCircle.backend.repository.CommentRepository;
import uniCircle.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentDTO createComment(Long postId, Long userId, Visibility visibility) {
        Board post = boardRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid post ID"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .visibility(visibility)
                .createdAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);
        return CommentDTO.fromEntity(savedComment);
    }

    @Transactional
    public CommentDTO getCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid comment ID"));
        return CommentDTO.fromEntity(comment);
    }

    @Transactional
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId).stream()
                .map(CommentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDTO updateComment(Long commentId, Visibility visibility) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid comment ID"));

        comment = Comment.builder()
                .commentId(commentId)
                .post(comment.getPost())
                .user(comment.getUser())
                .visibility(visibility)
                .createdAt(comment.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        Comment updatedComment = commentRepository.save(comment);
        return CommentDTO.fromEntity(updatedComment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new IllegalArgumentException("Invalid comment ID");
        }
        commentRepository.deleteById(commentId);
    }
}
