package uniCircle.backend.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import uniCircle.backend.dto.AdmissionFormDTO;
import uniCircle.backend.dto.UserDTO;
import uniCircle.backend.dto.request.AdmissionFormRequest;
import uniCircle.backend.dto.response.ErrorResponse;
import uniCircle.backend.dto.response.SuccessResponse;
import uniCircle.backend.entity.Status;
import uniCircle.backend.repository.UserRepository;
import uniCircle.backend.service.AdmissionFormService;
import uniCircle.backend.service.CircleUserService;
import uniCircle.backend.service.UserService;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/forms")
public class AdmissionFormController {
    
    private final AdmissionFormService admissionFormService;
    private final CircleUserService circleUserService;
    private final UserService userService;
    private final UserRepository userRepository;

    //Create operations

    //폼 생성
    @PostMapping("/create")
    @Operation(
            summary = "새로운 입부신청서 작성, UserID, CircleID가 반드시 포함되어야 함",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "입부신청서 생성 성공",
                            content = @Content(schema = @Schema(implementation = AdmissionFormDTO.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "요청 본문이 누락되거나 잘못됨",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
    public ResponseEntity<AdmissionFormDTO> createForm(@RequestBody AdmissionFormRequest request) {
        AdmissionFormDTO admissionFormDTO = AdmissionFormDTO.builder()
                .circleId(request.getCircleId())
                .userId(request.getUserId())
                .formContent(request.getFormContent())
                .createdAt(LocalDateTime.now())
                .status(Status.PENDING)
                .build();    
        admissionFormService.createAdmissionForm(admissionFormDTO);
        return ResponseEntity.ok(admissionFormDTO);
    }

    //Read Operations
    
    //form ID로 GET
    @GetMapping("/content/{formId}")
    @Operation(
            summary = "저장된 입부신청서 불러오기",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "입부신청서 불러오기 성공",
                            content = @Content(schema = @Schema(implementation = AdmissionFormDTO.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "입부신청서가 존재하지 않음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
    public ResponseEntity<Map<String, Object>> getFormById(@PathVariable Long formId) {
        AdmissionFormDTO form = admissionFormService.getAdmissionFormById(formId);

        Map<String, Object> formMap = new HashMap<>();

        Long userId = form.getUserId();
        UserDTO userDTO = userService.findByUserId(userId);

        formMap.put("form", form);
        formMap.put("userNickName", userDTO.getNickname());
        return ResponseEntity.ok(formMap);
    }

    //user ID로 GET
    @GetMapping("/searchuser/{userId}")
    @Operation(
            summary = "User ID에 따른 입부신청서 검색",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "UserID가 일치하는 리스트 전송 성공",
                            content = @Content(schema = @Schema(implementation = AdmissionFormDTO.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "유저가 존재하지 없음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
    public ResponseEntity<List<Map<String, Object>>> getFormsByUserId(@PathVariable Long userId) {
        List<Map<String, Object>> forms = admissionFormService.getAdmissionFormsByUserId(userId);
        return ResponseEntity.ok(forms);
    }

    //circle ID로 GET
    @GetMapping("/searchcircle/{circleId}")
    @Operation(
            summary = "Circle ID에 따른 입부신청서 검색",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Circle ID가 일치하는 입부신청서 리스트 전송 성공",
                            content = @Content(schema = @Schema(implementation = AdmissionFormDTO.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "동아리가 존재하지 없음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
    public ResponseEntity<List<Map<String, Object>>> getFormsByCircleId(@PathVariable Long circleId) {
        List<Map<String, Object>> forms = admissionFormService.getAdmissionFormsByCircleId(circleId);
        return ResponseEntity.ok(forms);
    }

    //Update Operations

    //@PutMapping("/{id}") updateform - 폼 변경
    @PutMapping("/updatecontent/{formId}")
    @Operation(
            summary = "입부신청서 질답 내용 수정",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "입부신청서 질답 내용 수정 성공",
                            content = @Content(schema = @Schema(implementation = AdmissionFormDTO.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "입부신청서가 존재하지 않음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
    public ResponseEntity<AdmissionFormDTO> updateAdmissionFormContent(@PathVariable Long formId, @RequestBody AdmissionFormRequest request) {
        AdmissionFormDTO form = admissionFormService.updateAdmissionFormContent(formId, request.getFormContent());
        return ResponseEntity.ok(form);
    }

    @PutMapping("/updatestatus/{formId}/{status}")
    @Operation(
            summary = "입부신청서 상태 변경",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "입부신청서 상태 변경 성공",
                            content = @Content(schema = @Schema(implementation = AdmissionFormDTO.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "상태 명칭이 잘못됨",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "입부신청서가 존재하지 않음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
    public ResponseEntity<AdmissionFormDTO> updateAdmissionFormStatus(@PathVariable Long formId, @PathVariable String status) {
        AdmissionFormDTO form = admissionFormService.updateAdmissionFormStatus(formId, status);
        return ResponseEntity.ok(form);
    }

    @PutMapping("/accept/{formId}")
    @Operation(
            summary = "입부신청서 승인 및 동아리원으로 추가",
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "입부신청서 승인됨",
                        content = @Content(schema = @Schema(implementation = AdmissionFormDTO.class)
                        )
                ),
                @ApiResponse(
                            responseCode = "400",
                            description = "이미 승인된 신청서거나 사용자가 이미 가입되어있음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class)
                            )
                    ),
                @ApiResponse(
                        responseCode = "404",
                        description = "입부신청서가 존재하지 않음",
                        content = @Content(schema = @Schema(implementation = ErrorResponse.class)
                        )
                )
        }
    )
    public ResponseEntity<AdmissionFormDTO> AcceptAdmissionForm(@PathVariable Long formId) {
        AdmissionFormDTO form = admissionFormService.acceptAdmissionForm(formId);
        return ResponseEntity.ok(form);
    }

    //Delete Operations
    @DeleteMapping("/delete/{formId}")
    @Operation(
            summary = "입부신청서 삭제",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "입부신청서가 성공적으로 삭제됨",
                            content = @Content(schema = @Schema(implementation = SuccessResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "입부신청서가 존재하지 않음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    public ResponseEntity<String> deleteAdmissionForm(@PathVariable Long formId) {
        admissionFormService.deleteAdmissionForm(formId);
        return ResponseEntity.ok("입부신청서가 성공적으로 삭제되었습니다.");
    }
}