package uniCircle.backend.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import uniCircle.backend.dto.CircleDTO;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.dto.request.CircleRequest;
import uniCircle.backend.dto.response.ErrorResponse;
import uniCircle.backend.dto.response.SuccessResponse;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.repository.UserRepository;
import uniCircle.backend.service.CircleService;
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
    private final UserRepository userRepository;

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
                .build();
        circleService.createCircle(circleDTO);
        return "redirect:/";
    }

    @Operation(summary = "Search Circle")
    @PostMapping("/search")
    public List<String> searchCircle(@RequestParam String keyword) {
        return circleService.searchCircle(keyword).stream()
                .map(Circle::getName)
                .collect(Collectors.toList());
    }

    @PostMapping("update")
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
    public String updateCircle(@RequestParam Long id, @RequestBody CircleRequest circleRequest) {
        // circle id로 어떤 circle을 update 할지 결정
        // Url에서 가져오는 @PathVariable 고려하기
        String adminUserEmail = circleRequest.getEmail();
        UserDTO adminUser = userService.findByEmail(adminUserEmail);

        CircleDTO circleDTO = CircleDTO.builder()
                .circleId(id)
                .name(circleRequest.getName())
                .description(circleRequest.getDescription())
                .adminUser(adminUser)
                .build();
        circleService.updateCircle(circleDTO);
        return "redirect:/";
    }
}
