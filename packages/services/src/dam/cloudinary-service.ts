import { v2 as cloudinary } from "cloudinary";
import type { DAM } from "./dam-interface";
import assert from "assert";

export interface Config {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

export const getCloudinaryConfig = (): Config => {
  const {
    CLOUDINARY_CLOUD_NAME: cloud_name,
    CLOUDINARY_API_KEY: api_key,
    CLOUDINARY_API_SECRET: api_secret,
  } = process.env;

  assert(cloud_name, "CLOUDINARY_CLOUD_NAME is not set");
  assert(api_key, "CLOUDINARY_API_KEY is not set");
  assert(api_secret, "CLOUDINARY_API_SECRET is not set");

  return {
    cloud_name,
    api_key,
    api_secret,
  };
};

export class CloudinaryService implements DAM {
  private readonly cloudinary: typeof cloudinary;

  constructor(public readonly config: () => Config) {
    this.cloudinary = cloudinary;
    this.cloudinary.config(config());
  }

  public async upload(file: string, identifier: string): Promise<string> {
    try {
      const result = await this.cloudinary.uploader.upload(file, {
        public_id: identifier,
        unique_filename: false,
        overwrite: true,
      });

      return result.public_id;
    } catch (error) {
      throw error;
    }
  }
}
