import { type InferModel, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const DMStatusSchema = sqliteTable("dmStatus", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  courseId: integer("courseId").notNull(),
  vIndex: integer("vIndex").notNull(),
  metaStatus: text("metaStatus").notNull(),
  videoStatus: text("videoStatus").notNull(),
  captionStatus: text("captionStatus").notNull(),
  dtMetaStart: text("dtMetaStart").notNull(),
  dtVideoStart: text("dtVideoStart"),
  dtCaptionStart: text("dtCaptionStart"),
  dtMetaEnd: text("dtMetaEnd"),
  dtVideoEnd: text("dtVideoEnd"),
  dtCaptionEnd: text("dtCaptionEnd"),
  dlMetaRetryCount: integer("dlMetaRetryCount"),
  dlVideoRetryCount: integer("dlVideoRetryCount"),
  dlCaptionRetryCount: integer("dlCaptionRetryCount"),

  videoSz: integer("videoSz"),
  captionSz: integer("captionSz"),
  finished: integer("finished").notNull(),
  interupted: integer("interupted").notNull(),

  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type TDMStatusSchema = InferModel<typeof DMStatusSchema>
