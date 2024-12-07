package uniCircle.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import uniCircle.backend.entity.Board;
import uniCircle.backend.entity.Circle;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findAllByCircle(Circle circle);

    @Query("SELECT b FROM Board b ORDER BY b.createdAt DESC")
    List<Board> findAllByOrderByCreatedAtDesc();
}
