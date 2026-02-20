package com.nextlevel.domain.gacha;

import com.nextlevel.common.ApiResponse;
import com.nextlevel.domain.gacha.dto.GachaResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/gacha")
@RequiredArgsConstructor
public class GachaController {

    private final GachaService gachaService;
    private final GoodsRepository goodsRepository;

    @PostMapping("/attempt")
    public ResponseEntity<ApiResponse<GachaResultResponse>> attempt(
            @AuthenticationPrincipal String employeeId) {
        return ResponseEntity.ok(ApiResponse.success(gachaService.attempt(employeeId)));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<GachaResultResponse>>> getHistory(
            @AuthenticationPrincipal String employeeId) {
        return ResponseEntity.ok(ApiResponse.success(gachaService.getHistory(employeeId)));
    }

    @GetMapping("/stock")
    public ResponseEntity<ApiResponse<List<Goods>>> getStock() {
        return ResponseEntity.ok(ApiResponse.success(goodsRepository.findAll()));
    }
}
