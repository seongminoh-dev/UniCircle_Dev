package uniCircle.backend.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import com.google.gson.JsonObject;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import org.springframework.boot.json.GsonJsonParser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import uniCircle.backend.dto.BoardDTO;
import uniCircle.backend.dto.request.BoardRequest;
import uniCircle.backend.dto.response.ErrorResponse;
import uniCircle.backend.dto.response.SuccessResponse;
import uniCircle.backend.entity.Board;
import uniCircle.backend.service.BoardService;
import uniCircle.backend.entity.Visibility;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping(consumes = {"multipart/form-data"})
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
    public ResponseEntity<BoardDTO> createBoard(@ModelAttribute BoardRequest boardRequest) throws IOException {

        MultipartFile file = boardRequest.getFile();
        byte[] imageData = null;

        if (file != null && !file.isEmpty()) {
            imageData = file.getBytes();
        }

        BoardDTO boardDTO = BoardDTO.builder()
                .userId(boardRequest.getUserId())
                .circleId(boardRequest.getCircleId())
                .title(boardRequest.getTitle())
                .content(boardRequest.getContent())
                .visibility(boardRequest.getVisibility())
                .hashtagId(boardRequest.getHashtagId())
                .isNotice(boardRequest.getIsNotice())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .image(imageData) // 이미지 데이터 설정
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
    public ResponseEntity<?> getBoardById(@PathVariable Long postId) {
        JsonObject jsonObject = boardService.getBoardByIdAndUserInfo(postId);
        return ResponseEntity.ok(jsonObject.toString());
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

    @GetMapping("/circle/{circleId}")
    @Operation(
            summary = "동아리의 게시글 모두 조회",
            description = "주어진 동아리 ID에 해당하는 동아리의 게시글 모두 조회.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시글이 성공적으로 조회됨",
                            content = @Content(schema = @Schema(implementation = SuccessResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "게시글을 찾을 수 없음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    public ResponseEntity<?> getBoardByCircleId(@PathVariable Long circleId) {
        List<BoardDTO> boardDTOs = boardService.getAllBoardByCircleId(circleId);

        return ResponseEntity.ok(boardDTOs);
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
    public ResponseEntity<BoardDTO> updateBoard(@PathVariable Long postId, @ModelAttribute BoardRequest boardRequest) throws IOException {

        byte[] imageData = null;
        MultipartFile file = boardRequest.getFile();

        if(file != null && !file.isEmpty()){
            imageData = file.getBytes();
        }

        BoardDTO boardDTO = BoardDTO.builder()
                .userId(boardRequest.getUserId())
                .circleId(boardRequest.getCircleId())
                .title(boardRequest.getTitle())
                .content(boardRequest.getContent())
                .visibility(boardRequest.getVisibility())
                .hashtagId(boardRequest.getHashtagId())
                .isNotice(boardRequest.getIsNotice())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .image(imageData) // 이미지 데이터 설정
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
