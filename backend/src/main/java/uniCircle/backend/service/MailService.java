package uniCircle.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;
    private final ConcurrentHashMap<String, String> verificationCodes = new ConcurrentHashMap<>();

    // 인증 코드 생성
    public String generateAndStoreVerificationCode(String email) {
        String verificationCode = generateVerificationCode();
        verificationCodes.put(email, verificationCode);
        return verificationCode;
    }

    // 인증 코드 검증
    public boolean verifyCode(String email, String code) {
        String storedCode = verificationCodes.get(email);
        if (storedCode != null && storedCode.equals(code)) {
            verificationCodes.remove(email); // 인증 후 코드 제거
            return true;
        }
        return false;
    }

    // 이메일 전송
    public void sendVerificationEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your Verification Code");
        message.setText("Your verification code is: " + code);
        mailSender.send(message);
        log.info("Verification code sent to {}", to);
    }

    // 인증 코드 생성 (내부 메서드)
    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000)); // 6자리 랜덤 숫자
    }
}