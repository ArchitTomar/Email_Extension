package com.EmailAgent.demo;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(
        origins = {"https://mail.google.com", "http://localhost:5173"},
        methods = {RequestMethod.POST, RequestMethod.OPTIONS}
)
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateEmail(@RequestBody EmailRequest emailRequest) {
        String response = emailService.generateEmailReply(emailRequest);

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("content", response);

        return ResponseEntity.ok(responseBody); // ✅ returns JSON
    }
}
