package com.nextlevel.domain.comment.dto;

import com.nextlevel.domain.comment.Comment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommentResponse {

    private Long commentId;
    private String authorName;
    private String suggestion;
    private String expectedEffect;
    private LocalDateTime createdAt;

    public static CommentResponse of(Comment comment) {
        return CommentResponse.builder()
                .commentId(comment.getCommentId())
                .authorName(comment.getUser().getName())
                .suggestion(comment.getSuggestion())
                .expectedEffect(comment.getExpectedEffect())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
