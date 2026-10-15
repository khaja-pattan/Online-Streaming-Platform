package com.streamflix.user.service;

import com.streamflix.user.dto.AuthRequest;
import com.streamflix.user.dto.AuthResponse;
import com.streamflix.user.dto.RegisterRequest;
import com.streamflix.user.dto.UpdateProfileRequest;
import com.streamflix.user.dto.UserProfileDto;
import com.streamflix.user.model.Role;
import com.streamflix.user.model.User;
import com.streamflix.user.repository.UserRepository;
import com.streamflix.user.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already in use.");
        }

        Role role = Role.ROLE_USER;
        if (request.getRole() != null && (request.getRole().equalsIgnoreCase("ROLE_ADMIN") || request.getRole().equalsIgnoreCase("ADMIN"))) {
            role = Role.ROLE_ADMIN;
        }

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(token, mapToDto(savedUser));
    }

    public AuthResponse login(AuthRequest request) {
        String identifier = request.getUsernameOrEmail().trim();
        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier.toLowerCase()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, mapToDto(user));
    }

    public UserProfileDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found."));
        return mapToDto(user);
    }

    public UserProfileDto getUserProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User '" + username + "' not found."));
        return mapToDto(user);
    }

    @Transactional
    public UserProfileDto updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found."));

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            String newUsername = request.getUsername().trim();
            if (!newUsername.equalsIgnoreCase(user.getUsername()) && userRepository.existsByUsername(newUsername)) {
                throw new IllegalArgumentException("Username '" + newUsername + "' is already taken.");
            }
            user.setUsername(newUsername);
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String newEmail = request.getEmail().trim().toLowerCase();
            if (!newEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("Email '" + newEmail + "' is already in use.");
            }
            user.setEmail(newEmail);
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
                throw new IllegalArgumentException("Current password verification failed.");
            }
            if (request.getNewPassword().length() < 6) {
                throw new IllegalArgumentException("New password must be at least 6 characters long.");
            }
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    public UserProfileDto mapToDto(User user) {
        return new UserProfileDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
