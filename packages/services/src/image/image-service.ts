import { InvalidImageFormatError } from '../errors/invalid-image-format-error';
import { ImageUploadError } from '../errors/image-upload-error';
import type { DAM } from '../dam/dam-interface';

export interface BaseImageService {
  upload(file: string, identifier: string): Promise<string>;
}

export class ImageService implements BaseImageService {
  constructor(private readonly damService: DAM) {}

  public async upload(file: string, identifier: string): Promise<string> {
    if (!this.validateImageFormat(file)) {
      throw new InvalidImageFormatError(this.getMimeType(file) ?? '');
    }

    try {
      return await this.damService.upload(file, identifier);
    } catch (error) {
      throw new ImageUploadError((error as Error).message);
    }
  }

  private validateImageFormat(file: string) {
    const IMAGE_MIME_TYPES = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    try {
      const match = file.match(/^data:(.*?);base64,(.*)$/);
      if (!match) return false;

      const [, mimeType, base64Data] = match;

      if (!base64Data) return false;
      if (!IMAGE_MIME_TYPES.includes(mimeType ?? '')) return false;

      const buffer = Buffer.from(base64Data, 'base64');
      return buffer.length > 0;
    } catch {
      return false;
    }
  }

  private getMimeType(file: string) {
    const match = file.match(/^data:(.*?);base64,.*$/);
    if (!match) return null;

    return match[1];
  }
}
