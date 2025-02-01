/*
import { EventEmitter } from 'events';
import axios from 'axios';
import { createLogger, format, transports } from 'winston';

export class ProductionSecurityMonitor {
  private readonly targetUrl: string;
  private readonly logger: any;
  private readonly eventEmitter: EventEmitter;
  private readonly alertThresholds: {
    responseTime: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
  };

  constructor(targetUrl: string, alertWebhook?: string) {
    this.targetUrl = targetUrl;
    this.eventEmitter = new EventEmitter();

    // Initialize logger
    this.logger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.json(),
      ),
      transports: [
        new transports.File({ filename: 'security-test.log' }),
        new transports.Console(),
      ],
    });

    // Default alert thresholds
    this.alertThresholds = {
      responseTime: 1000, // ms
      errorRate: 5, // percentage
      cpuUsage: 80, // percentage
      memoryUsage: 80, // percentage
    };

    // Set up alert handlers
    if (alertWebhook) {
      this.setupAlertHandlers(alertWebhook);
    }
  }

  private setupAlertHandlers(webhookUrl: string) {
    this.eventEmitter.on('alert', async (data) => {
      try {
        await axios.post(webhookUrl, {
          text: `🚨 Security Test Alert: ${data.message}`,
          data: data,
        });
      } catch (error) {
        this.logger.error('Failed to send alert', { error });
      }
    });
  }

  async monitorEndpoint(
    requestsPerSecond: number = 1,
    duration: number = 60,
    path: string = '/',
  ) {
    const startTime = Date.now();
    const metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      responseTimesMs: [] as number[],
      errors: [] as any[],
    };

    this.logger.info('Starting production security test', {
      targetUrl: this.targetUrl,
      requestsPerSecond,
      duration,
    });

    while ((Date.now() - startTime) < duration * 1000) {
      const requestStart = Date.now();

      try {
        const response = await axios.get(`${this.targetUrl}${path}`, {
          timeout: 5000,
          headers: {
            'X-Security-Test': 'true',
          },
        });

        const responseTime = Date.now() - requestStart;
        metrics.responseTimesMs.push(responseTime);
        metrics.successfulRequests++;

        // Check response time threshold
        if (responseTime > this.alertThresholds.responseTime) {
          this.eventEmitter.emit('alert', {
            type: 'high_latency',
            message: `High latency detected: ${responseTime}ms`,
            responseTime,
          });
        }

      } catch (error) {
        metrics.failedRequests++;
        metrics.errors.push({
          timestamp: new Date(),
          error: error.message,
        });

        // Calculate error rate
        const errorRate = (metrics.failedRequests / metrics.totalRequests) * 100;
        if (errorRate > this.alertThresholds.errorRate) {
          this.eventEmitter.emit('alert', {
            type: 'high_error_rate',
            message: `High error rate detected: ${errorRate.toFixed(2)}%`,
            errorRate,
          });
        }
      }

      metrics.totalRequests++;

      // Respect the requests per second limit
      await new Promise(resolve =>
        setTimeout(resolve, 1000 / requestsPerSecond),
      );
    }

    // Generate final report
    const report = this.generateReport(metrics);
    this.logger.info('Security test completed', report);

    return report;
  }

  private generateReport(metrics: any) {
    const avgResponseTime = metrics.responseTimesMs.reduce((a: number, b: number) => a + b, 0) / metrics.responseTimesMs.length;

    return {
      duration: `${(Date.now() - metrics.startTime) / 1000}s`,
      totalRequests: metrics.totalRequests,
      successRate: `${((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(2)}%`,
      averageResponseTime: `${avgResponseTime.toFixed(2)}ms`,
      errorCount: metrics.failedRequests,
      errorRate: `${((metrics.failedRequests / metrics.totalRequests) * 100).toFixed(2)}%`,
      errorSamples: metrics.errors.slice(0, 5), // Show first 5 errors
    };
  }
}

const monitor = new ProductionSecurityMonitor(
  'https://business-dev-ehjzlee.imrsiv.co/',
  'https://example.com',
);

await monitor.monitorEndpoint(10, 60);*/
