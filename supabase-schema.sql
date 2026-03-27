-- ============================================
-- Supabase SQL Schema for ALLWEONE Presentation AI
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUM TYPES
-- ============================================
CREATE TYPE "DocumentType" AS ENUM ('PRESENTATION');

-- ============================================
-- TABLES
-- ============================================

-- Users table
CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "clerkId" TEXT,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "headline" TEXT,
    "bio" TEXT,
    "interests" TEXT NOT NULL DEFAULT '[]',
    "location" TEXT,
    "website" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "hasAccess" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Account table (OAuth providers)
CREATE TABLE "Account" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- BaseDocument table
CREATE TABLE "BaseDocument" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "userId" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "documentType" TEXT NOT NULL,

    CONSTRAINT "BaseDocument_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BaseDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Presentation table
CREATE TABLE "Presentation" (
    "id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'mystique',
    "imageSource" TEXT NOT NULL DEFAULT 'stock',
    "prompt" TEXT,
    "presentationStyle" TEXT,
    "language" TEXT DEFAULT 'en-US',
    "outline" JSONB NOT NULL DEFAULT '[]',
    "searchResults" JSONB,
    "templateId" TEXT,
    "customThemeId" TEXT,

    CONSTRAINT "Presentation_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Presentation_id_fkey" FOREIGN KEY ("id") REFERENCES "BaseDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CustomTheme table
CREATE TABLE "CustomTheme" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "logoUrl" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "themeData" JSONB NOT NULL,

    CONSTRAINT "CustomTheme_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CustomTheme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "CustomTheme_userId_idx" ON "CustomTheme"("userId");

-- Add FK from Presentation to CustomTheme (after CustomTheme exists)
ALTER TABLE "Presentation"
    ADD CONSTRAINT "Presentation_customThemeId_fkey"
    FOREIGN KEY ("customThemeId") REFERENCES "CustomTheme"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- FavoriteDocument table
CREATE TABLE "FavoriteDocument" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FavoriteDocument_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "FavoriteDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "BaseDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FavoriteDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- GeneratedImage table
CREATE TABLE "GeneratedImage" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "GeneratedImage_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "GeneratedImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- Prisma migrations tracking table
-- (So Prisma knows the DB is in sync)
-- ============================================
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMP WITH TIME ZONE,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMP WITH TIME ZONE,
    "started_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- Insert a default public user for instant mode
-- ============================================
INSERT INTO "User" ("id", "name", "email", "role", "hasAccess")
VALUES ('public-session', 'Public Visitor', 'public@allweone.app', 'USER', true)
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- Auto-update "updatedAt" trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_basedocument_updated_at BEFORE UPDATE ON "BaseDocument"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customtheme_updated_at BEFORE UPDATE ON "CustomTheme"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generatedimage_updated_at BEFORE UPDATE ON "GeneratedImage"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
