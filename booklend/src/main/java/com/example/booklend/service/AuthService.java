// java
package com.example.booklend.service;

import com.example.booklend.dto.LoginRequest;
import com.example.booklend.dto.RegisterRequest;
import com.example.booklend.model.Role;
import com.example.booklend.model.User;
import com.example.booklend.repository.UserRepository;
import com.example.booklend.security.CustomUserDetailsService;
import com.example.booklend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private CustomUserDetailsService userDetailsService;

    public ResponseEntity<?> register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
		user.setFirstName(req.getFirstName());
		user.setLastName(req.getLastName());
        user.setRole(Role.USER);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    public ResponseEntity<?> authenticate(LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        var userDetails = userDetailsService.loadUserByUsername(req.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
