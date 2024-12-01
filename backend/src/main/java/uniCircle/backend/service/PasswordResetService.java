package uniCircle.backend.service;

import jakarta.validation.constraints.Null;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uniCircle.backend.entity.User;
import uniCircle.backend.repository.UserRepository;

import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    public boolean resetPassword(String username, String email) {
        // 새 비밀번호 생성
        String newPassword = generateRandomPassword();

        // 새 비밀번호로 업데이트
        userService.changePassword(email, username, passwordEncoder.encode(newPassword));

        // 새 비밀번호 이메일 전송
        sendPasswordResetEmail(email, newPassword);
        return true;
    }

    private String generateRandomPassword() {
        Random random = new Random();
        return random.ints(48, 122) // ASCII 범위: 숫자, 소문자, 대문자 포함
                .filter(i -> Character.isLetterOrDigit(i))
                .limit(10) // 10자리 비밀번호
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }

    private void sendPasswordResetEmail(String to, String newPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your Password Has Been Reset");
        message.setText("Your new password is: " + newPassword + "\nPlease log in and change your password immediately.");
        mailSender.send(message);
        log.info("Password reset email sent to {}", to);
    }
}
