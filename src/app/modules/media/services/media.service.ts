import { BadRequestException, Injectable } from "@nestjs/common";
import { MediaRepository } from "../repositories/media.repository";
import * as path from "path";
import * as fs from "fs";
import { UploadMediaDTO } from "../dtos/upload-media.dto";
import { Filetype } from "@prisma/client";
// import * as ffmpeg from 'fluent-ffmpeg';
// import * as sharp from 'sharp';
// import * as pdf from 'pdf-parse';
// import * as xlsx from 'xlsx';

@Injectable()
export class MediaService {
  private _supportedImageExtensions: string[] = [".jpg", ".jpeg", ".png"];
  private _supportedVideoExtensions: string[] = [
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
  ];
  private _supportedFileExtensions: string[] = [".pdf", ".xlsx"];
  private _publicDirectory: string = path.join(process.cwd(), "public");
  constructor(private readonly _mediaRepository: MediaRepository) {}

  // TODO : extract metadata , supported uploading mp3 and sound files
  async processMedia(uploadMediaDTO: UploadMediaDTO) {
    const fileBuffer =
      (await fs.promises.readFile(uploadMediaDTO.file.path)) ??
      Buffer.from(uploadMediaDTO.file.buffer);
    const fileExtension = path
      .extname(uploadMediaDTO.file.originalname)
      .toLowerCase();
    const fileName = path.basename(this.generateTripleRandom(), fileExtension);
    const filePath = path.join(
      this._publicDirectory,
      `${fileName}${fileExtension}`,
    );

    // save media
    // TODO : configure cloud upload like AWS CDN and S3 storage
    fs.writeFileSync(filePath, fileBuffer);

    const metaData = this.extractMetadata(
      filePath,
      fileExtension,
      `${fileName}${fileExtension}`,
    );
    return this._mediaRepository.create(metaData);
  }

  // TODO : add stronger hashes depending on time , handle the case of collisions
  generateTripleRandom() {
    const firstRandom = (Date.now() + Math.random().toString().slice(2, 6))
      .split("")
      .reverse()
      .join("");
    const secondRandom =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const thirdRandom = Math.random().toString(36).slice(2, 11);
    const timestamp = Date.now().toString();
    const randomDigits = Array.from(timestamp)
      .filter((char: any) => !isNaN(char))
      .slice(0, 3);
    const result = `${randomDigits.join("")}.${firstRandom}.${secondRandom}.${thirdRandom}`;
    return result;
  }

  // TODO : support more extensions
  private extractMetadata(
    filePath: string,
    fileExtension: string,
    fileName: string,
  ) {
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

    // if (this.supportedImageExtensions.includes(fileExtension))
    return this.processImage(filePath, fileSize, fileName);
    throw new BadRequestException(
      "Uploaded media is not supported it must be one of the following",
    );
  }

  private processImage(filePath: string, fileSize: number, fileName: string) {
    return {
      fileName,
      size: fileSize,
      type: Filetype.image,
    };
    // const image = await sharp(filePath).metadata();
    // return {
    //     type: 'image',
    //     size: fileSize,
    //     width: image.width,
    //     height: image.height,
    //     format: image.format,
    // };
  }

  // private async processVideo(filePath: string, fileSize: number) {
  //     const metadata = await this.getVideoMetadata(filePath);
  //     const thumbnailPath = await this.generateThumbnail(filePath);
  //     return {
  //         type: 'video',
  //         size: fileSize,
  //         ...metadata,
  //         thumbnail: thumbnailPath,
  //     };
  // }

  //   private async processPDF(filePath: string, fileSize: number) {
  //     const dataBuffer = fs.readFileSync(filePath);
  //     const pdfData = await pdf(dataBuffer);
  //     return {
  //       type: 'pdf',
  //       size: fileSize,
  //       numPages: pdfData.numpages,
  //       info: pdfData.info,
  //     };
  //   }

  //   private async processExcel(filePath: string, fileSize: number) {
  //     const workbook = xlsx.readFile(filePath);
  //     const sheetNames = workbook.SheetNames;
  //     return {
  //       type: 'excel',
  //       size: fileSize,
  //       sheetNames,
  //     };
  //   }

  // private async getVideoMetadata(filePath: string) {
  //     return new Promise<any>((resolve, reject) => {
  //         ffmpeg.ffprobe(filePath, (err, metadata) => {
  //             if (err) reject(err);
  //             resolve({
  //                 duration: metadata.format.duration,
  //                 codec: metadata.streams[0].codec_name,
  //                 width: metadata.streams[0].width,
  //                 height: metadata.streams[0].height,
  //             });
  //         });
  //     });
  // }

  // private async generateThumbnail(filePath: string) {
  //     const thumbnailPath = path.join(__dirname, '..', '..', 'uploads', 'thumbnail.png');
  //     return new Promise<string>((resolve, reject) => {
  //         ffmpeg(filePath)
  //             .screenshots({
  //                 count: 1,
  //                 folder: path.dirname(thumbnailPath),
  //                 filename: 'thumbnail.png',
  //                 size: '320x240',
  //             })
  //             .on('end', () => resolve(thumbnailPath))
  //             .on('error', reject);
  //     });
  // }

  public get supportedImageExtensions() {
    return this._supportedImageExtensions;
  }
  public get supportedVideoExtensions() {
    return this._supportedVideoExtensions;
  }
  private get supportedFileExtensions() {
    return this._supportedFileExtensions;
  }
}
