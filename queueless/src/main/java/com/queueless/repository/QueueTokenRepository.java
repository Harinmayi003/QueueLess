package com.queueless.repository;

import com.queueless.entity.QueueToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QueueTokenRepository extends JpaRepository<QueueToken, Long> {

    Optional<QueueToken> findFirstByStatusOrderByTokenNumberAsc(String status);

}