package com.kloudspot.ems.controller;

import com.kloudspot.ems.dto.ApiResponse;
import com.kloudspot.ems.dto.LoginRequestDTO;
import com.kloudspot.ems.dto.LoginResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Authentication", description = "Endpoints for administrator authentication")
public class AuthController {

    @PostMapping("/login")
    @Operation(summary = "Admin login", description = "Authenticates an administrator with username and password")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        // Standard admin credentials for evaluation
        if ("admin".equalsIgnoreCase(loginRequest.getUsername()) && "admin123".equals(loginRequest.getPassword())) {
            String token = "ems-jwt-token-" + UUID.randomUUID();
            LoginResponseDTO response = new LoginResponseDTO(
                    token,
                    loginRequest.getUsername(),
                    "ROLE_ADMIN",
                    "Authentication successful"
            );
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        }

        return new ResponseEntity<>(
                ApiResponse.error("Invalid username or password. Default admin credentials are: admin / admin123"),
                HttpStatus.UNAUTHORIZED
        );
    }
}
