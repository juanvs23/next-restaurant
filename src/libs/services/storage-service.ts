import fs from "fs/promises";
import path from "path";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export interface StorageProvider {
  upload(
    file: Buffer,
    filename: string,
    mimeType: string,
  ): Promise<{ url: string; size: number }>;
  delete(url: string): Promise<void>;
}

class LocalProvider implements StorageProvider {
  async upload(file: Buffer, filename: string, _mimeType: string) {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const key = `${Date.now()}-${filename}`;
    await fs.writeFile(path.join(UPLOADS_DIR, key), file);
    return { url: `/uploads/${key}`, size: file.length };
  }

  async delete(url: string) {
    const key = url.replace("/uploads/", "");
    if (!key || key === url) return;
    try {
      await fs.unlink(path.join(UPLOADS_DIR, key));
    } catch {
      // File already gone — noop
    }
  }
}

class S3Provider implements StorageProvider {
  private s3: S3Client;
  private bucket: string;
  private baseUrl: string;

  constructor(config: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
    endpoint?: string;
  }) {
    this.s3 = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.endpoint || undefined,
      forcePathStyle: !!config.endpoint,
    });
    this.bucket = config.bucket;
    this.baseUrl = config.endpoint
      ? `${config.endpoint.replace(/\/+$/, "")}/${config.bucket}`
      : `https://${config.bucket}.s3.${config.region}.amazonaws.com`;
  }

  async upload(file: Buffer, filename: string, mimeType: string) {
    const key = `${Date.now()}-${filename}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );
    return { url: `${this.baseUrl}/${key}`, size: file.length };
  }

  async delete(url: string) {
    const key = url.replace(`${this.baseUrl}/`, "");
    if (!key || key === url) return;
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}

export function getStorageProvider(config: {
  storageProvider?: string;
  s3Config?: {
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
    bucket?: string;
    endpoint?: string;
  };
}): StorageProvider {
  if (config.storageProvider === "s3" && config.s3Config?.bucket) {
    return new S3Provider({
      accessKeyId: config.s3Config.accessKeyId || "",
      secretAccessKey: config.s3Config.secretAccessKey || "",
      region: config.s3Config.region || "",
      bucket: config.s3Config.bucket,
      endpoint: config.s3Config.endpoint || undefined,
    });
  }
  return new LocalProvider();
}
