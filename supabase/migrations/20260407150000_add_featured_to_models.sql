-- Migration: Add featured flag to models
ALTER TABLE "public"."modelos" ADD COLUMN "is_featured" BOOLEAN DEFAULT false;
ALTER TABLE "public"."modelos" ADD COLUMN "featured_order" INTEGER DEFAULT 0;

-- Optionally, add an index for performance
CREATE INDEX idx_modelos_featured ON "public"."modelos" ("is_featured") WHERE "is_featured" = true;
