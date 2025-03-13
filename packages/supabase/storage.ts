import { romanize } from "es-hangul";

// 안전한 파일명 생성을 위한 유틸리티
export class FileNameConverter {
  // 안전한 문자 패턴 정의
  private static readonly SAFE_CHARACTERS = /^[a-zA-Z0-9!\-_.*'()]+$/;

  private static generateRandomString(length: number = 8): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  }

  // 파일명이 안전한 문자들로만 구성되었는지 확인
  private static isSafeFileName(name: string): boolean {
    return this.SAFE_CHARACTERS.test(name);
  }

  // 안전하지 않은 문자를 포함한 파일명을 안전한 형식으로 변환
  private static convertToSafeFileName(name: string): string {
    try {
      // 파일명 정규화
      const normalized = name.trim().normalize();

      // 한글이나 특수문자가 있는지 확인
      const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(normalized);
      const hasSpecialChars = /[^A-Za-z0-9]/.test(normalized);

      if (!hasKorean && !hasSpecialChars) {
        return normalized;
      }

      // 한글이 있는 경우 로마자로 변환 시도
      if (hasKorean) {
        const romanized = romanize(normalized);
        if (romanized && romanized !== normalized) {
          // 로마자 변환 결과에서 안전하지 않은 문자 제거
          return romanized.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        }
      }

      // 변환 실패 시 랜덤 문자열 생성
      return this.generateRandomString();
    } catch (error) {
      console.error("Conversion error:", error);
      return this.generateRandomString();
    }
  }

  // 원본 파일명을 안전한 형식으로 변환
  static encode(fileName: string): string {
    console.log("Original filename:", fileName);

    const extension = fileName.split(".").pop() || "";
    const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf("."));

    const safeName = this.isSafeFileName(nameWithoutExt)
      ? nameWithoutExt
      : this.convertToSafeFileName(nameWithoutExt);

    console.log("Safe filename:", safeName);

    return `${safeName}_${Date.now()}.${extension}`;
  }

  // 파일명에서 타임스탬프 제거하여 원본 이름 추출
  static decode(fileName: string): string {
    const [name] = fileName.split("_");
    return name || fileName;
  }
}

// 이미지 URL 생성 함수
export function getImageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_STORAGE_BUCKET}/${path}`;
}

// 날짜 포맷팅 함수 추가
export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // 1일 이내
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    if (hours < 1) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes}분 전`;
    }
    return `${hours}시간 전`;
  }

  // 30일 이내
  if (diff < 30 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}일 전`;
  }

  // 그 외
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
