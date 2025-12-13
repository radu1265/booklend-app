package com.example.booklend.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;

    public LoginRequest() {}

    public void setEmail(String email) { this.email = email; }

    public void setPassword(String password) { this.password = password; }
}

