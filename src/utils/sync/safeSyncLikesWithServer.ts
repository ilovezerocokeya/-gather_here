import { useLikeStore } from "@/stores/useLikeStore";

const syncedUserIds = new Set<string>(); // 이미 동기화한 userId 저장

export const safeSyncLikesWithServer = async (userId: string) => {
  if (!userId || syncedUserIds.has(userId)) return;

  syncedUserIds.add(userId);
  try {
    await useLikeStore.getState().syncLikesWithServer(userId);
  } catch (err) {
    console.error("[safeSyncLikesWithServer] 에러 발생:", err);
    syncedUserIds.delete(userId); // 실패 시 다시 시도 가능하도록
    throw err;
  }
};