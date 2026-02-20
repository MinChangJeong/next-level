package com.nextlevel.domain.gacha;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GoodsRepository extends JpaRepository<Goods, String> {

    List<Goods> findByRemainingStockGreaterThan(int stock);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT g FROM Goods g WHERE g.goodsId = :goodsId")
    Optional<Goods> findByIdWithLock(String goodsId);
}
