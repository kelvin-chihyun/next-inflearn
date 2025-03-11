// 안전한 파일명 생성을 위한 유틸리티
export class FileNameConverter {
  private static readonly SAFE_CHARACTERS = /[^0-9a-zA-Z!\-_.*'()]/g;

  // Base64 변환 함수들
  private static base64ToBytes(base64: string): Uint8Array {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0) || 0);
  }

  private static bytesToBase64(bytes: Uint8Array): string {
    const binString = Array.from(bytes, (byte) =>
      String.fromCodePoint(byte)
    ).join("");
    return btoa(binString);
  }

  // 원본 파일명을 안전한 형식으로 변환
  static encode(fileName: string): string {
    const timestamp = Date.now();
    const extension = fileName.split(".").pop() || "";
    const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf("."));

    // 한글 등 UTF-8 문자열을 Base64로 변환
    const encodedName = this.bytesToBase64(
      new TextEncoder().encode(nameWithoutExt)
    );

    // 안전한 문자만 포함된 파일명 생성
    const safeFileName = encodedName.replace(this.SAFE_CHARACTERS, "_");

    // 타임스탬프를 추가하여 유니크한 파일명 생성
    return `${safeFileName}_${timestamp}.${extension}`;
  }

  // 안전한 형식의 파일명을 원본으로 복원
  static decode(encodedFileName: string): string {
    const [encodedPart] = encodedFileName.split("_");
    try {
      return new TextDecoder().decode(
        this.base64ToBytes(encodedPart as string)
      );
    } catch {
      return encodedFileName; // 디코딩 실패 시 원본 반환
    }
  }
}

// 이미지 URL 생성 함수
export function getImageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_STORAGE_BUCKET}/${path}`;
}
