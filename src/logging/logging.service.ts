import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';
import { Writable } from 'stream';

@Injectable()
export class LoggingService implements OnApplicationShutdown {
  private logLevel: number;
  private logFileStream: Writable;
  private errorFileStream: Writable;
  private logsDirectory = 'logs';
  private maxSize: number;
  private initialized = false;

  constructor() {
    this.logLevel = parseInt(process.env.LOG_LEVEL || '4', 10);
    this.maxSize = parseInt(process.env.LOG_MAX_SIZE || '1024', 10) * 1024;
    this.initializeLogs().catch((err) => {
      console.error('Failed to initialize logs:', err);
    });
  }

  private async initializeLogs() {
    try {
      await this.ensureLogsDirectory();
      await this.setupLogStreams();
      this.initialized = true;
    } catch (err) {
      console.error('Logging initialization error:', err);
      this.initialized = true;
    }
  }

  private async ensureLogsDirectory() {
    try {
      await fs.mkdir(this.logsDirectory, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        console.error('Failed to create logs directory:', err);
      }
    }
  }

  private async setupLogStreams() {
    await this.rotateLog('app.log');
    await this.rotateLog('error.log');

    this.logFileStream = this.createFileStream('app.log');
    this.errorFileStream = this.createFileStream('error.log');
  }

  private createFileStream(filename: string): Writable {
    const stream = createWriteStream(join(this.logsDirectory, filename), {
      flags: 'a',
    });

    stream.on('error', (err) => {
      console.error(`File stream error (${filename}):`, err);
    });

    return stream;
  }

  private async writeToBoth(message: string, isError: boolean) {
    if (isError) {
      process.stderr.write(message + '\n');
    } else {
      process.stdout.write(message + '\n');
    }

    if (this.initialized) {
      const fileStream = isError ? this.errorFileStream : this.logFileStream;
      if (fileStream && !fileStream.destroyed) {
        await new Promise((resolve) => {
          if (!fileStream.write(message + '\n', 'utf8', resolve)) {
            fileStream.once('drain', resolve);
          }
        });
      }
    }
  }

  async log(message: string) {
    if (this.logLevel >= 2) {
      await this.writeToBoth(
        `[LOG]        - ${new Date().toISOString()}    ${message}`,
        false,
      );
    }
  }

  async error(message: string) {
    await this.writeToBoth(
      `[ERROR]      - ${new Date().toISOString()}   ${message}`,
      true,
    );
  }

  async warn(message: string) {
    if (this.logLevel >= 1) {
      await this.writeToBoth(
        `[WARN]       - ${new Date().toISOString()}   ${message}`,
        true,
      );
    }
  }

  private async rotateLog(filename: string) {
    try {
      const filePath = join(this.logsDirectory, filename);
      const stats = await fs.stat(filePath);

      if (stats.size > this.maxSize) {
        const newPath = `${filePath}.${Date.now()}`;
        await fs.rename(filePath, newPath);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error('Log rotation error:', err);
      }
    }
  }

  async onApplicationShutdown() {
    const closeStream = (stream: Writable) =>
      new Promise<void>((resolve) => {
        if (!stream || stream.destroyed) return resolve();
        stream.end(() => resolve());
      });

    await closeStream(this.logFileStream);
    await closeStream(this.errorFileStream);
  }
}
