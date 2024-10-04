package uniCircle.backend.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

@Entity
@Getter
@Table(name = "circle_user")
public class CircleUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "circle_user_id")
    private Long circleUserId;

    @ManyToOne
    @JoinColumn(name = "circle_id", nullable = false)
    private Circle circle;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder
    public CircleUser(Long circleUserId, Circle circle, User user) {
        this.circleUserId = circleUserId;
        this.circle = circle;
        this.user = user;
    }

    public CircleUser() {
    }

    public void addCircleUser(Circle circle, User user){
        this.circle = circle;
        this.user = user;
        circle.getCircleUsers().add(this);
        user.getCircleUsers().add(this);
    }

}