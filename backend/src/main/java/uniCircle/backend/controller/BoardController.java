package uniCircle.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import uniCircle.backend.dto.BoardDTO;
import uniCircle.backend.dto.response.ErrorResponse;
import uniCircle.backend.dto.response.SuccessResponse;
import uniCircle.backend.service.BoardService;
import uniCircle.backend.entity.Visibility;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    @Operation(
            summary = "게시글 생성",
            description = "새로운 게시글을 생성합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시글이 성공적으로 생성됨",
                            content = @Content(schema = @Schema(implementation = BoardDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "잘못된 요청",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    public ResponseEntity<BoardDTO> createBoard(
            @Parameter(description = "사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "모임 ID", required = true) @RequestParam Long circleId,
            @Parameter(description = "게시글 제목", required = true) @RequestParam String title,
            @Parameter(description = "게시글 내용", required = true) @RequestParam String content,
            @Parameter(description = "게시글 공개 범위", required = true) @RequestParam Visibility visibility,
            @Parameter(description = "해시태그 ID (선택적)") @RequestParam(required = false) Long hashtagId,
            @Parameter(description = "공지 여부", required = true) @RequestParam Boolean isNotice) {

        BoardDTO boardDTO = BoardDTO.builder()
                .userId(userId)
                .circleId(circleId)
                .title(title)
                .content(content)
                .visibility(visibility)
                .hashtagId(hashtagId)
                .isNotice(isNotice)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        BoardDTO createdBoard = boardService.createBoard(boardDTO);
        return ResponseEntity.ok(createdBoard);
    }

    @GetMapping("/{postId}")
    @Operation(
            summary = "특정 게시글 조회",
            description = "주어진 게시글 ID로 특정 게시글을 조회합니다.",
            parameters = {
                    @Parameter(name = "postId", description = "조회할 게시글의 ID", required = true, example = "1")
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시글 정보 조회 성공",
                            content = @Content(schema = @Schema(implementation = BoardDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "게시글을 찾을 수 없음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    public ResponseEntity<BoardDTO> getBoardById(@PathVariable Long postId) {
        BoardDTO board = boardService.getBoardById(postId);
        return ResponseEntity.ok(board);
    }

    @GetMapping
    @Operation(
            summary = "모든 게시글 조회",
            description = "등록된 모든 게시글을 조회합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시글 목록 조회 성공",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = BoardDTO.class)))
                    )
            }
    )
    public ResponseEntity<List<BoardDTO>> getAllPosts() {
        List<BoardDTO> posts = boardService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{postId}")
    @Operation(
            summary = "게시글 수정",
            description = "주어진 게시글 ID에 해당하는 게시글을 수정합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시글이 성공적으로 수정됨",
                            content = @Content(schema = @Schema(implementation = BoardDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "게시글을 찾을 수 없음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    public ResponseEntity<BoardDTO> updateBoard(
            @PathVariable Long postId,
            @RequestParam Long userId,
            @RequestParam Long circleId,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam Visibility visibility,
            @RequestParam(required = false) Long hashtagId,
            @RequestParam Boolean isNotice) {

        BoardDTO boardDTO = BoardDTO.builder()
                .postId(postId)
                .userId(userId)
                .circleId(circleId)
                .title(title)
                .content(content)
                .visibility(visibility)
                .hashtagId(hashtagId)
                .isNotice(isNotice)
                .updatedAt(LocalDateTime.now())
                .build();

        BoardDTO updatedBoard = boardService.updateBoard(postId, boardDTO);
        return ResponseEntity.ok(updatedBoard);
    }

    @DeleteMapping("/{postId}")
    @Operation(
            summary = "게시글 삭제",
            description = "주어진 게시글 ID에 해당하는 게시글을 삭제합니다.",
            parameters = {
                    @Parameter(name = "postId", description = "삭제할 게시글의 ID", required = true, example = "1")
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시글이 성공적으로 삭제됨",
                            content = @Content(schema = @Schema(implementation = SuccessResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "게시글을 찾을 수 없음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    public ResponseEntity<String> deleteBoard(@PathVariable Long postId) {
        boardService.deleteBoard(postId);
        return ResponseEntity.ok("게시글이 성공적으로 삭제되었습니다.");
    }
}
