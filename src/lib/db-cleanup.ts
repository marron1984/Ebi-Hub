/**
 * Ebi-Hub — テストデータ一括削除スクリプト
 *
 * 本番移行時にテスト用データを削除し、メンバー・スポット情報のみ残す。
 *
 * 使用方法:
 *   npx tsx src/lib/db-cleanup.ts
 *
 * ⚠️ おにくリーダーの承認を得てから実行してください。
 *    チーム・メンバー・スポットは削除されません。
 */

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:dev.db" });
const prisma = new PrismaClient({ adapter });

async function cleanup() {
  console.log("🦐 Ebi-Hub Data Cleanup");
  console.log("========================");
  console.log("⚠️  以下のテストデータを削除します:");
  console.log("   - セッション (Session)");
  console.log("   - ハンド履歴 (HandHistory + HandComment)");
  console.log("   - 対戦相手メモ (OpponentNote + OpponentEncounter)");
  console.log("   - アクティビティ (Activity)");
  console.log("");
  console.log("✅ 以下は保持されます:");
  console.log("   - チーム (Team)");
  console.log("   - メンバー (User) — おにく他9名");
  console.log("   - スポット (Spot) — 大阪13店舗");
  console.log("   - トーナメント (Tournament)");
  console.log("   - デイリーイベント (DailyEvent)");
  console.log("");

  // Delete in dependency order (children first)
  const handComments = await prisma.handComment.deleteMany();
  console.log(`  🗑️  HandComment: ${handComments.count} 件削除`);

  const encounters = await prisma.opponentEncounter.deleteMany();
  console.log(`  🗑️  OpponentEncounter: ${encounters.count} 件削除`);

  const opponents = await prisma.opponentNote.deleteMany();
  console.log(`  🗑️  OpponentNote: ${opponents.count} 件削除`);

  const hands = await prisma.handHistory.deleteMany();
  console.log(`  🗑️  HandHistory: ${hands.count} 件削除`);

  const sessions = await prisma.session.deleteMany();
  console.log(`  🗑️  Session: ${sessions.count} 件削除`);

  const activities = await prisma.activity.deleteMany();
  console.log(`  🗑️  Activity: ${activities.count} 件削除`);

  console.log("");
  console.log("✅ クリーンアップ完了！");
  console.log("   メンバー・スポット・トーナメント情報は保持されています。");
  console.log("   本番運用を開始できます。🦐");
}

cleanup()
  .catch((e) => {
    console.error("❌ クリーンアップ中にエラーが発生しました:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
