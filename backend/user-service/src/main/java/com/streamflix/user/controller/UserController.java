package com.streamflix.user.controller;

import com.streamflix.user.dto.UpdateProfileRequest;
import com.streamflix.user.dto.UserProfileDto;
import com.streamflix.user.security.JwtService;
import com.streamflix.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    private Long resolveUserId(String xUserId, String authHeader) {
        if (xUserId != null && !xUserId.isBlank()) {
            try {
                return Long.parseLong(xUserId);
            } catch (NumberFormatException ignored) {
            }
        }
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtService.extractUserId(token);
        }
        return null;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(
            @RequestHeader(value = "X-User-Id", required = false) String xUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Long userId = resolveUserId(xUserId, authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserProfileDto profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateCurrentUser(
            @RequestHeader(value = "X-User-Id", required = false) String xUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody UpdateProfileRequest request) {

        Long userId = resolveUserId(xUserId, authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserProfileDto updatedProfile = userService.updateProfile(userId, request);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDto> getUserById(@PathVariable Long id) {
        UserProfileDto profile = userService.getUserProfile(id);
        return ResponseEntity.ok(profile);
    }
}
