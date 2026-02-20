package com.nextlevel.domain.comment;

import com.nextlevel.common.ApiResponse;
import com.nextlevel.domain.comment.dto.CommentRequest;
import com.nextlevel.domain.comment.dto.CommentResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/booths/{boothId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable String boothId) {
        return ResponseEntity.ok(ApiResponse.success(commentService.getComments(boothId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable String boothId,
            @AuthenticationPrincipal String employeeId,
            @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(commentService.addComment(boothId, employeeId, request)));
    }
}
