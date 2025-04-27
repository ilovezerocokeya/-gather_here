// "use client";

// import React from "react";
// import PostCardLong from "@/components/Common/Card/PostCard/PostCardLong";
// import AdCard from "@/components/MainPage/AdCard/AdCard";
// import InitialLoadingWrapper from "@/components/Common/Loading/InitialLoadingWrapper";
// import SpinnerLoader from "@/components/Common/Loading/SpinnerLoader";
// import { PostWithUser } from "@/types/posts/Post.type";

// interface InfiniteScrollComponentProps {
//   posts: PostWithUser[];
//   isFetchingNextPage: boolean;
//   hasNextPage: boolean;
// }

// const InfiniteScrollComponent: React.FC<InfiniteScrollComponentProps> = ({ posts, isFetchingNextPage, hasNextPage }) => {
//   return (
//     <InitialLoadingWrapper>
//       {posts.length === 0 ? (
//         <p style={{ textAlign: "center", color: "white" }}>해당 조건에 맞는 게시물이 없습니다</p>
//       ) : (
//         <div className="flex flex-col gap-6">
//           {posts.map((post, index) => (
//             <React.Fragment key={`${post.post_id}_${index}`}>
//               <PostCardLong post={post} />
//               {(index + 1) % 5 === 0 && <AdCard key={`ad_${index}`} />}
//             </React.Fragment>
//           ))}

//           {/* 👇 추가 데이터 로딩 중이면 로딩 스피너 표시 */}
//           {isFetchingNextPage && (
//             <div className="flex justify-center items-center w-full py-8">
//               <SpinnerLoader />
//             </div>
//           )}

//           {/* 👇 모든 데이터 다 불러왔으면 끝 문구 표시 */}
//           {!hasNextPage && (
//             <p className="text-center text-white py-8">
//               모든 포스트를 불러왔습니다
//             </p>
//           )}
//         </div>
//       )}
//     </InitialLoadingWrapper>
//   );
// };

// export default InfiniteScrollComponent;