package com.example.booklend;

import com.example.booklend.model.Book;
import com.example.booklend.model.Role;
import com.example.booklend.model.User;
import com.example.booklend.repository.BookRepository;
import com.example.booklend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BooklendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BooklendApplication.class, args);
    }

    // --- SEEDER: Adds a default Admin and some books on startup ---
    @Bean
    CommandLineRunner run(UserRepository userRepository, BookRepository bookRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.findByEmail("admin@booklend.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@booklend.com");
                admin.setPassword(encoder.encode("admin123"));
				admin.setFirstName("admin");
				admin.setLastName("admin");
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }
//            if (bookRepository.count() == 0) {
//                bookRepository.save(new Book("The Great Gatsby", "F. Scott Fitzgerald", "Classic", "A story of decadence and excess.", 5, true));
//                bookRepository.save(new Book("Clean Code", "Robert C. Martin", "Education", "A handbook of agile software craftsmanship.", 10, true));
//            }
        };
    }

}
