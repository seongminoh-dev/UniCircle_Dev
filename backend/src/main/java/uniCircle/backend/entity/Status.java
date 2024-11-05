package uniCircle.backend.entity;

public enum Status {
    PENDING("확인 대기중"),
    ACCEPTED("수락됨"),
    REJECTED("거절됨"),
    CANCELLED("취소됨");

    private final String description;

    Status(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}