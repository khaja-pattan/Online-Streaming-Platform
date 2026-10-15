package com.streamflix.user;

import com.streamflix.user.dto.AuthRequest;
import com.streamflix.user.dto.AuthResponse;
import com.streamflix.user.dto.RegisterRequest;
import com.streamflix.user.model.Role;
import com.streamflix.user.model.User;
import com.streamflix.user.repository.UserRepository;
import com.streamflix.user.security.JwtService;
import com.streamflix.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest("alice", "alice@example.com", "Password@123", "ROLE_USER");
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("encoded_pass");

        User savedUser = new User("alice", "alice@example.com", "encoded_pass", Role.ROLE_USER);
        savedUser.setId(10L);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(savedUser)).thenReturn("mock_token");

        AuthResponse response = userService.register(request);

        assertNotNull(response);
        assertEquals("mock_token", response.getToken());
        assertEquals("alice", response.getUser().getUsername());
        assertEquals(Role.ROLE_USER, response.getUser().getRole());
    }

    @Test
    void register_DuplicateUsername_ThrowsException() {
        RegisterRequest request = new RegisterRequest("alice", "alice@example.com", "Password@123", "ROLE_USER");
        when(userRepository.existsByUsername("alice")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> userService.register(request));
    }

    @Test
    void login_Success() {
        AuthRequest request = new AuthRequest("alice", "Password@123");
        User user = new User("alice", "alice@example.com", "encoded_pass", Role.ROLE_USER);
        user.setId(10L);

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password@123", "encoded_pass")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("valid_jwt");

        AuthResponse response = userService.login(request);

        assertNotNull(response);
        assertEquals("valid_jwt", response.getToken());
        assertEquals("alice", response.getUser().getUsername());
    }

    @Test
    void login_WrongPassword_ThrowsException() {
        AuthRequest request = new AuthRequest("alice", "WrongPass");
        User user = new User("alice", "alice@example.com", "encoded_pass", Role.ROLE_USER);

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPass", "encoded_pass")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> userService.login(request));
    }
}
