package uniCircle.backend.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uniCircle.backend.dto.CircleDTO;
import uniCircle.backend.dto.request.CircleRequest;
import uniCircle.backend.dto.response.ErrorResponse;
import uniCircle.backend.dto.response.SuccessResponse;
import uniCircle.backend.entity.Circle;
import uniCircle.backend.service.CircleService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CircleController {

    private final CircleService circleService;

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
        CircleDTO circleDTO = CircleDTO.builder()
                .name(circleRequest.getName())
                .description(circleRequest.getDescription())
                .createdAt(LocalDateTime.now())
                .build();
        circleService.createCircle(circleDTO);  // circleAdminUser 받아와서 추가해야함
        return "redirect:/";
    }

    @Operation(summary = "Search Circle")
    @PostMapping("/search")
    public List<String> searchCircle(@RequestParam String keyword) {
        return circleService.searchCircle(keyword).stream()
                .map(Circle::getName)
                .collect(Collectors.toList());
    }

}
