"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchContent } from "@/services/Search";
import BoardPreview from "@/components/BoardPreview";
import CirclePreview from "@/components/CirclePreview";

const SearchPage = () => {
    // 쿼리 값 가져오기
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    // UI
    const [filteredCircles, setFilteredCircles] = useState([]);
    const [filteredBoards, setFilteredBoards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        try {
            const data = await searchContent(query); // 서비스 호출
            setFilteredCircles(data.filteredCircles);
            setFilteredBoards(data.filteredBoards);
        } catch (error) {
            console.error(error.message);
            setFilteredCircles([]);
            setFilteredBoards([]);
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, [query]);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">&quot;{query}&quot; 검색 결과</h2>
        {loading ? (
            <p>로딩 중...</p>
        ) : (
            <>
            {/* 동아리 검색 결과 */}
            <div className="mb-8">
                <h3 className="text-xl font-bold">동아리</h3>
                {filteredCircles.length > 0 ? (
                <div className="flex flex-col space-y-4">
                {filteredCircles.map((circle) => (
                  <CirclePreview key={circle.id} circle={circle} />
                ))}
                </div>
            ) : (
              <p>동아리가 없습니다.</p>
            )}
            </div>

            {/* 게시글 검색 결과 */}
            {filteredBoards.length > 0 ? (
            <div>
                <h3 className="text-xl font-bold">게시글</h3>
                {filteredBoards.length > 0 ? (
                <div className="flex flex-col space-y-4">
                {filteredBoards.map((board) => (
                    <BoardPreview key={board.id} board={board} />
                ))}
            </div>
            ) : (
              <p>게시글이 없습니다.</p>
            )}
            </div>
            ):(<div></div>)}
            </>
        )}
        </div>
    );
};

export default SearchPage;
