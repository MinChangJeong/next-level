package com.nextlevel.common;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 모든 API 응답에 사용되는 통일된 응답 형식.
 *
 * @param <T> 응답 데이터 타입
 */
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ApiResponse<T> {

    private final boolean success;
    private final String message;
    private final T data;
    private final String errorCode;

    /**
     * 성공 응답을 생성한다.
     *
     * @param data 응답 데이터
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "요청이 성공적으로 처리되었습니다.", data, null);
    }

    /**
     * 데이터 없는 성공 응답을 생성한다. (삭제 등)
     */
    public static <T> ApiResponse<T> success() {
        return new ApiResponse<>(true, "요청이 성공적으로 처리되었습니다.", null, null);
    }

    /**
     * 에러 응답을 생성한다.
     *
     * @param message   사용자에게 보여줄 에러 메시지 (한글)
     * @param errorCode 에러 코드 (영문 대문자 + 언더스코어)
     */
    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return new ApiResponse<>(false, message, null, errorCode);
    }
}
