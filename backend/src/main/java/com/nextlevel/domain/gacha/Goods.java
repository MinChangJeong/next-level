package com.nextlevel.domain.gacha;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "goods")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Goods {

    @Id
    @Column(name = "goods_id", length = 20)
    private String goodsId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private int totalStock;

    @Column(nullable = false)
    private int remainingStock;

    @Column(nullable = false)
    private int unitPrice;

    public boolean hasStock() {
        return this.remainingStock > 0;
    }

    public void decreaseStock() {
        if (this.remainingStock <= 0) {
            throw new IllegalStateException("굿즈 재고가 없습니다.");
        }
        this.remainingStock--;
    }
}
