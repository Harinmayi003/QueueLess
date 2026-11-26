package com.queueless.service;

import com.queueless.entity.QueueToken;
import com.queueless.repository.QueueTokenRepository;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Comparator;

@Service
public class QueueTokenService {

    private final QueueTokenRepository queueTokenRepository;

    private static final int SERVICE_TIME_MINUTES = 5;

    public QueueTokenService(QueueTokenRepository queueTokenRepository) {
        this.queueTokenRepository = queueTokenRepository;
    }

    // Create a new queue token
    public QueueToken createToken(String customerName) {

        QueueToken token = new QueueToken();

        token.setCustomerName(customerName);
        token.setTokenNumber((int) queueTokenRepository.count() + 1);
        token.setStatus("WAITING");
        token.setJoinedAt(LocalDateTime.now());
        token.setEstimatedWaitMinutes(0);

        queueTokenRepository.save(token);

        updateQueuePositions();

        return token;
    }

    // Get all queue tokens
    public List<QueueToken> getAllTokens() {

        updateQueuePositions();

        return queueTokenRepository.findAll();
    }

    // Call the next customer
    public QueueToken callNextCustomer() {

        QueueToken nextToken = queueTokenRepository
                .findFirstByStatusOrderByTokenNumberAsc("WAITING")
                .orElseThrow(() -> new RuntimeException("No customers waiting"));

        nextToken.setStatus("SERVING");

        queueTokenRepository.save(nextToken);

        updateQueuePositions();

        return nextToken;
    }

    // Skip the next waiting customer
    public QueueToken skipNextCustomer() {

        QueueToken nextToken = queueTokenRepository
                .findFirstByStatusOrderByTokenNumberAsc("WAITING")
                .orElseThrow(() -> new RuntimeException("No customers waiting"));

        nextToken.setStatus("SKIPPED");

        queueTokenRepository.save(nextToken);

        updateQueuePositions();

        return nextToken;
    }

    // Complete the current customer's service
    public QueueToken completeCurrentCustomer() {

        QueueToken currentToken = queueTokenRepository
                .findFirstByStatusOrderByTokenNumberAsc("SERVING")
                .orElseThrow(() -> new RuntimeException("No customer is currently being served"));

        currentToken.setStatus("COMPLETED");

        queueTokenRepository.save(currentToken);

        updateQueuePositions();

        return currentToken;
    }

    // Calculate queue positions and estimated waiting times
    private void updateQueuePositions() {

        List<QueueToken> allTokens = queueTokenRepository.findAll();

        // Reset positions for all customers
        for (QueueToken token : allTokens) {
            token.setQueuePosition(null);
            token.setEstimatedWaitMinutes(0);
        }

        // Select only waiting customers and sort by token number
        List<QueueToken> waitingCustomers = allTokens.stream()
                .filter(token -> "WAITING".equals(token.getStatus()))
                .sorted(Comparator.comparing(QueueToken::getTokenNumber))
                .toList();

        // Assign queue position and waiting time
        for (int i = 0; i < waitingCustomers.size(); i++) {

            QueueToken token = waitingCustomers.get(i);

            token.setQueuePosition(i + 1);
            token.setEstimatedWaitMinutes(i * SERVICE_TIME_MINUTES);
        }

        queueTokenRepository.saveAll(allTokens);
    }
}