package com.streamflix.user.config;

import com.streamflix.user.model.Role;
import com.streamflix.user.model.User;
import com.streamflix.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default administrator if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@streamflix.com");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);
            System.out.println(">>> Seeded default administrator: admin / Admin@123");
        }

        // Seed default standard user if not exists
        if (!userRepository.existsByUsername("john_doe")) {
            User user = new User();
            user.setUsername("john_doe");
            user.setEmail("john@streamflix.com");
            user.setPasswordHash(passwordEncoder.encode("User@123"));
            user.setRole(Role.ROLE_USER);
            userRepository.save(user);
            System.out.println(">>> Seeded default user: john_doe / User@123");
        }
    }
}
