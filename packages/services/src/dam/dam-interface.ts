export interface DAM {
  upload(file: string, identifier: string): Promise<string>;
  getImages(cursor: string): Promise<{ nextCursor: string; images: string[] }>;
}
