package uniCircle.backend.controller;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uniCircle.backend.dto.HashtagDTO;
import uniCircle.backend.dto.response.ErrorResponse;
import uniCircle.backend.service.HashtagService;

import java.util.List;

@RestController
@RequestMapping("/hashtags")
@RequiredArgsConstructor
public class HashtagController {

    private final HashtagService hashtagService;

    @PostMapping
    @Operation(
            summary = "해시태그 생성",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "해시태그가 성공적으로 생성됨",
                            content = @Content(schema = @Schema(implementation = HashtagDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "잘못된 요청",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    public ResponseEntity<HashtagDTO> createHashtag(@RequestBody HashtagDTO hashtagDTO) {
        HashtagDTO createdHashtag = hashtagService.createHashtag(hashtagDTO);
        return ResponseEntity.ok(createdHashtag);
    }

    @GetMapping
    @Operation(
            summary = "모든 해시태그 조회",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "해시태그 목록 조회 성공",
                            content = @Content(schema = @Schema(implementation = HashtagDTO.class))
                    )
            }
    )
    public ResponseEntity<List<HashtagDTO>> getAllHashtags() {
        List<HashtagDTO> hashtags = hashtagService.getAllHashtags();
        return ResponseEntity.ok(hashtags);
    }
}
