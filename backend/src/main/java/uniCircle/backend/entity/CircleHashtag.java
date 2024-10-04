package uniCircle.backend.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

// M:N 구조를 표현하기 위한 클래스
@Entity
@Getter
@Table(name = "circle_hashtag")
public class CircleHashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "circle_hashtag_id")
    private Long circleHashtagId;

    @ManyToOne
    @JoinColumn(name = "circle_id", nullable = false)
    private Circle circle;

    @ManyToOne
    @JoinColumn(name = "hashtag_id", nullable = false)
    private Hashtag hashtag;

    @Builder
    public CircleHashtag(Circle circle) {
        this.circle = circle;
    }

    public CircleHashtag() {

    }
}
