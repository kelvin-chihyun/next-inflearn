import { romanize } from "es-hangul";

// 안전한 파일명 생성을 위한 유틸리티
export class FileNameConverter {
  // 안전한 문자 패턴 정의
  private static readonly SAFE_CHARACTERS = /^[a-zA-Z0-9!\-_.*'()]+$/;

  // 파일명이 안전한 문자들로만 구성되었는지 확인
  private static isSafeFileName(name: string): boolean {
    return this.SAFE_CHARACTERS.test(name);
  }

  // 안전하지 않은 문자를 포함한 파일명을 안전한 형식으로 변환
  private static convertToSafeFileName(name: string): string {
    // 한글이 포함된 경우 로마자로 변환
    const romanized = romanize(name);
    // 여전히 안전하지 않은 특수문자가 있다면 언더스코어로 변환
    return romanized.replace(/[^a-zA-Z0-9!\-_.*'()]/g, "_");
  }

  // 원본 파일명을 안전한 형식으로 변환
  static encode(fileName: string): string {
    const timestamp = Date.now();
    const extension = fileName.split(".").pop() || "";
    const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf("."));

    // 파일명이 이미 안전한 문자들로만 구성되어 있는지 확인
    const safeName = this.isSafeFileName(nameWithoutExt)
      ? nameWithoutExt
      : this.convertToSafeFileName(nameWithoutExt);

    // 타임스탬프를 추가하여 유니크한 파일명 생성
    return `${safeName}_${timestamp}.${extension}`;
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
