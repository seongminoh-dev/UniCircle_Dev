package uniCircle.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uniCircle.backend.dto.BoardDTO;
import uniCircle.backend.dto.response.ErrorResponse;
import uniCircle.backend.dto.response.SuccessResponse;
import uniCircle.backend.service.BoardService;

import java.util.List;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    @Operation(
            summary = "게시글 생성",
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
    public ResponseEntity<BoardDTO> createBoard(@RequestBody BoardDTO boardDTO) {
        BoardDTO createdBoard = boardService.createBoard(boardDTO);
        return ResponseEntity.ok(createdBoard);
    }

    @GetMapping("/{postId}")
    @Operation(
            summary = "특정 게시글 조회",
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
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시글 목록 조회 성공",
                            content = @Content(schema = @Schema(implementation = BoardDTO.class))
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
    public ResponseEntity<BoardDTO> updateBoard(@PathVariable Long postId, @RequestBody BoardDTO boardDTO) {
        BoardDTO updatedBoard = boardService.updateBoard(postId, boardDTO);
        return ResponseEntity.ok(updatedBoard);
    }

    @DeleteMapping("/{postId}")
    @Operation(
            summary = "게시글 삭제",
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