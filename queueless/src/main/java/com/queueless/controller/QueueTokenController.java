package com.queueless.controller;

import com.queueless.entity.QueueToken;
import com.queueless.service.QueueTokenService;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/queue")
@CrossOrigin(origins = "http://localhost:5173")
public class QueueTokenController {

    private final QueueTokenService queueTokenService;

    public QueueTokenController(QueueTokenService queueTokenService) {
        this.queueTokenService = queueTokenService;
    }

    // Customer joins the queue
    @PostMapping("/join")
    public QueueToken joinQueue(@RequestBody JoinQueueRequest request) {
        return queueTokenService.createToken(request.customerName());
    }

    // Get all queue tokens
    @GetMapping
    public List<QueueToken> getAllTokens() {
        return queueTokenService.getAllTokens();
    }

    // Admin calls the next customer
    @PostMapping("/call-next")
    public QueueToken callNextCustomer() {
        return queueTokenService.callNextCustomer();
    }

    // Admin skips the next waiting customer
    @PostMapping("/skip-next")
    public QueueToken skipNextCustomer() {
        return queueTokenService.skipNextCustomer();
    }
    // Admin completes the current customer's service
@PostMapping("/complete")
public QueueToken completeCurrentCustomer() {
    return queueTokenService.completeCurrentCustomer();
}

    // Request body for joining the queue
    public record JoinQueueRequest(String customerName) {
    }
}