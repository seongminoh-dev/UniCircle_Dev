package uniCircle.backend.entity;

public enum Role {
    NON_MEMBER("비회원"),
    WANT_JOIN("입부 희망자"),
    REQUEST_JOIN("입부 신청자"),
    CIRCLE_MEMBER("동아리원"),
    CIRCLE_ADMIN("동아리 관리자"),
    SYSTEM_ADMIN("시스템 관리자");

    private final String description;

    Role(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
