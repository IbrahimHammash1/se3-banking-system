import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { envConfig } from "@common/config/env-config";
import { pgDump } from "pg-dump-restore";
import * as path from "path";
import * as fs from "fs";
@Injectable()
export class DatabaseCronjobBackupService {
  private readonly logger = new Logger(DatabaseCronjobBackupService.name);

  @Cron(CronExpression.EVERY_WEEK)
  async backupCronjob() {
    try {
      this.logger.log("Starting PostgreSQL database backup...");
      const backupFolder = path.resolve(
        process.cwd(),
        "public",
        "backup",
        `backup-${new Date().toISOString().split("T")[0]}`,
      );
      if (!fs.existsSync(backupFolder)) {
        fs.mkdirSync(backupFolder, { recursive: true });
      }
      const backupFile = path.join(
        backupFolder,
        `backup-${new Date().toISOString()}.sql`,
      );
      const { DATABASE_URL } = envConfig;
      const { host, port, database, username, password } =
        this.parseDatabaseUrl(DATABASE_URL);
      const { stdout, stderr } = await pgDump(
        {
          host,
          port,
          database,
          username,
          password,
        },
        {
          filePath: backupFile,
        },
      );
      if (stderr) {
        this.logger.error("Error in backup process:", stderr);
        return;
      }
      this.copyFilesWithTimestamp(backupFolder);
      this.logger.log("Backup completed successfully.");
      this.logger.log(stdout);
    } catch (error) {
      this.logger.error("Error during backup:", error);
    }
  }
  private parseDatabaseUrl(url: string) {
    const { username, password, host, port, pathname } = new URL(url);
    let parsedHost = host;
    let parsedPort = parseInt(port, 10) || 5432;
    if (host.includes(":")) {
      const [extractedHost, extractedPort] = host.split(":");
      parsedHost = extractedHost;
      parsedPort = parseInt(extractedPort, 10);
    }
    return {
      username,
      password,
      host: parsedHost,
      port: parsedPort,
      database: pathname.slice(1),
    };
  }

  private copyFilesWithTimestamp(backupFolder: string) {
    const publicFolder = path.resolve(process.cwd(), "public");
    const allowedExtensions = [".jpg", ".png", ".pdf"];

    const files = fs.readdirSync(publicFolder);

    files.forEach((file) => {
      const filePath = path.join(publicFolder, file);
      const ext = path.extname(file).toLowerCase();

      if (allowedExtensions.includes(ext) && fs.statSync(filePath).isFile()) {
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, ""); // Timestamp format without special chars
        const backupFilePath = path.join(backupFolder, `${timestamp}-${file}`);

        try {
          fs.copyFileSync(filePath, backupFilePath);
          this.logger.log(`Copied ${file} to backup folder.`);
        } catch (copyError) {
          this.logger.error(`Error copying ${file}:`, copyError);
        }
      }
    });
  }
}
