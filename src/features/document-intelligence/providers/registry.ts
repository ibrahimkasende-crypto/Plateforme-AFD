import "server-only";

import { getOcrConfig } from "@/features/document-intelligence/config";
import { createAwsTextractProvider } from "@/features/document-intelligence/providers/aws-textract";
import { createAzureProvider } from "@/features/document-intelligence/providers/azure-document-intelligence";
import { createGoogleProvider } from "@/features/document-intelligence/providers/google-document-ai";
import { createMockProvider } from "@/features/document-intelligence/providers/mock";
import { createNativeProvider } from "@/features/document-intelligence/providers/native";
import { createTesseractProvider } from "@/features/document-intelligence/providers/tesseract";
import type { DocumentIntelligenceProvider } from "@/features/document-intelligence/providers/types";

export function getNativeProvider(): DocumentIntelligenceProvider {
  return createNativeProvider();
}

export function getFallbackProvider(): DocumentIntelligenceProvider {
  return createTesseractProvider();
}

export function getActiveOcrProvider(): DocumentIntelligenceProvider {
  const cfg = getOcrConfig();
  switch (cfg.provider) {
    case "azure":
      return createAzureProvider();
    case "google":
      return createGoogleProvider();
    case "aws":
      return createAwsTextractProvider();
    case "tesseract":
      return createTesseractProvider();
    case "mock":
      if (!cfg.allowMock) {
        return createNativeProvider();
      }
      return createMockProvider();
    case "native":
    default:
      return createNativeProvider();
  }
}

export function getProviderLabel(): string {
  return getActiveOcrProvider().getProviderMetadata().name;
}
