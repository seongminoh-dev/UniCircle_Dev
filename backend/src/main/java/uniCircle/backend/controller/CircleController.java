package uniCircle.backend.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uniCircle.backend.dto.CircleDTO;
import uniCircle.backend.dto.HashtagDTO;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.dto.request.CircleRequest;
import uniCircle.backend.dto.response.ErrorResponse;
import uniCircle.backend.dto.response.SuccessResponse;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.repository.CircleUserRepository;
import uniCircle.backend.repository.UserRepository;
import uniCircle.backend.service.CircleHashtagService;
import uniCircle.backend.service.CircleService;
import uniCircle.backend.service.CircleUserService;
import uniCircle.backend.service.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CircleController {

    private final CircleService circleService;
    private final UserService userService;
    private final CircleUserService circleUserService;
    private final CircleHashtagService circleHashtagService;

    @PostMapping("create")
    @Operation(
            summary = "Create Circle",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successful operation",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = SuccessResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Bad request",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = ErrorResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Bad credentials",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
    public String createCircle(@RequestBody CircleRequest circleRequest) {
        String adminUserEmail = circleRequest.getEmail();
        UserDTO adminUser = userService.findByEmail(adminUserEmail);

        CircleDTO circleDTO = CircleDTO.builder()
                .name(circleRequest.getName())
                .description(circleRequest.getDescription())
                .createdAt(LocalDateTime.now())
                .adminUser(adminUser)
                .hashtags(circleRequest.getHashtagContents())
                .questions(circleRequest.getQuestions())
                .build();

        // circle 만들기
        CircleDTO createdCircle = circleService.createCircle(circleDTO);

        return "redirect:/";
    }

    @Operation(summary = "Search Circle")
    @GetMapping("/search")
    public ResponseEntity<List<CircleDTO>> searchCircle(@RequestParam String keyword) {
        List<CircleDTO> circleDTOs = circleService.searchCircles(keyword);
        return ResponseEntity.ok(circleDTOs);
    }

    @PostMapping("/{circleId}/update")
    @Operation(
            summary = "Update Circle",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successful operation",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = SuccessResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Bad request",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = ErrorResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Bad credentials",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
    public String updateCircle(@PathVariable Long circleId, @RequestBody CircleRequest circleRequest) {
        String adminUserEmail = circleRequest.getEmail();
        UserDTO adminUser = userService.findByEmail(adminUserEmail);

        CircleDTO circleDTO = CircleDTO.builder()
                .circleId(circleId)
                .name(circleRequest.getName())
                .description(circleRequest.getDescription())
                .adminUser(adminUser)
                .questions(circleRequest.getQuestions())
                .hashtags(circleRequest.getHashtagContents())
                .build();
        circleService.updateCircle(circleDTO);
        return "redirect:/";
    }

    @DeleteMapping("/{circleId}/delete")
    public void deleteCircle(@PathVariable Long circleId) {
        circleService.deleteCircle(circleId);
    }

    // 특정 Circle에 등록된 User 리스트 반환
    @GetMapping("/{circleId}/users")
    public ResponseEntity<List<UserDTO>> getUsersByCircle(@PathVariable Long circleId) {
        List<UserDTO> users = circleUserService.getUsersByCircle(circleId);
        return ResponseEntity.ok(users);
    }

    // 특정 User가 속해있는 Circle 리스트 반환
    @GetMapping("/{userEmail}/circles")
    public ResponseEntity<List<CircleDTO>> getCirclesByUser(@PathVariable String userEmail) {
        UserDTO userDTO = userService.findByEmail(userEmail);
        List<CircleDTO> circles = circleUserService.getCirclesByUser(userDTO);
        return ResponseEntity.ok(circles);
    }

    // circleId로 circle 반환
    @GetMapping("getcircle")
    public ResponseEntity<CircleDTO> getCircle(@RequestParam Long circleId) {
        CircleDTO circleDTO = circleService.getCircle(circleId);
        return ResponseEntity.ok(circleDTO);
    }

    // circle에 user추가
    @PostMapping("/{circleId}/add")
    public String addUserToCircle(@PathVariable Long circleId, @RequestParam String userEmail) {
        UserDTO userDTO = userService.findByEmail(userEmail);

        circleUserService.addUserToCircle(circleId, userDTO);

        return "redirect:/";
    }

    // circle에 속한 user 제거
    @DeleteMapping("/{circleId}/remove")
    public String removeUserFromCircle(@PathVariable Long circleId, @RequestParam String userEmail) {
        UserDTO userDTO = userService.findByEmail(userEmail);

        circleUserService.removeUserFromCircle(circleId, userDTO);

        return "redirect:/";
    }

    // circle의 hashtag 리스트
    @GetMapping("/{circleId}/hashtags")
    public ResponseEntity<List<HashtagDTO>> getHashtagsByCircle(@PathVariable Long circleId) {
        List<HashtagDTO> hashtags = circleHashtagService.getHashtagsFromCircle(circleId);
        return ResponseEntity.ok(hashtags);
    }

    // hashtag로 circle 검색
    @GetMapping("/hashtag/{content}")
    public ResponseEntity<List<CircleDTO>> getCirclesByHashtag(@PathVariable String content) {
        List<CircleDTO> circles = circleHashtagService.getCirclesFromHashtag(content);
        return ResponseEntity.ok(circles);
    }

}
