package uniCircle.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;
import uniCircle.backend.dto.CommentDTO;
import uniCircle.backend.dto.request.CommentRequest;
import uniCircle.backend.dto.response.SuccessResponse;
import uniCircle.backend.entity.Visibility;
import uniCircle.backend.service.CommentService;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@Slf4j
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @Operation(
            summary = "댓글 생성",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "댓글이 성공적으로 생성됨",
                            content = @Content(schema = @Schema(implementation = CommentDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "잘못된 요청",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentRequest commentRequest) {
        CommentDTO createdComment = commentService.createComment(
                commentRequest.getPostId(),
                commentRequest.getUserId(),
                commentRequest.getVisibility(),
                commentRequest.getContent());
        return ResponseEntity.ok(createdComment);
    }

    @GetMapping("/{commentId}")
    @Operation(
            summary = "특정 댓글 조회",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "댓글 정보 조회 성공",
                            content = @Content(schema = @Schema(implementation = CommentDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "댓글을 찾을 수 없음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable Long commentId) {
        CommentDTO comment = commentService.getCommentById(commentId);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/post/{postId}")
    @Operation(
            summary = "게시글에 달린 모든 댓글 조회",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "댓글 목록 조회 성공",
                            content = @Content(schema = @Schema(implementation = CommentDTO.class))
                    )
            }
    )
    public ResponseEntity<List<CommentDTO>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentDTO> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/{commentId}")
    @Operation(
            summary = "댓글 수정",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "댓글이 성공적으로 수정됨",
                            content = @Content(schema = @Schema(implementation = CommentDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "댓글을 찾을 수 없음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    public ResponseEntity<CommentDTO> updateComment(@PathVariable Long commentId,
                                                    @RequestBody CommentRequest commentRequest) {
        CommentDTO updatedComment = commentService.updateComment(
                commentRequest.getPostId(),
                commentRequest.getVisibility(),
                commentRequest.getContent());
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/{commentId}")
    @Operation(
            summary = "댓글 삭제",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "댓글이 성공적으로 삭제됨",
                            content = @Content(schema = @Schema(implementation = SuccessResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "댓글을 찾을 수 없음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok("댓글이 성공적으로 삭제되었습니다.");
    }
}
