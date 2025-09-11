import pino from 'pino';

// Create logger instance with healthcare-specific configuration
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
  // HIPAA-compliant logging - never log PHI directly
  redact: {
    paths: [
      'email',
      'password',
      'firstName',
      'lastName',
      'dateOfBirth',
      'zipCode',
      'notes',
      'symptoms',
      'req.body.password',
      'req.body.email',
      'req.body.firstName',
      'req.body.lastName',
      'req.body.dateOfBirth',
    ],
    censor: '[REDACTED]',
  },
  base: {
    env: process.env.NODE_ENV || 'development',
    service: 'asthma-api',
  },
});

// Healthcare-specific logging functions
export const auditLogger = {
  // Log authentication events
  loginAttempt: (data: { email?: string; ip?: string; userAgent?: string; success: boolean }) => {
    logger.info({
      event: 'LOGIN_ATTEMPT',
      success: data.success,
      ip: data.ip,
      userAgent: data.userAgent,
      timestamp: new Date().toISOString(),
    }, `Authentication attempt: ${data.success ? 'SUCCESS' : 'FAILED'}`);
  },

  // Log data access events
  dataAccess: (data: { userId: string; resource: string; action: string; ip?: string }) => {
    logger.info({
      event: 'DATA_ACCESS',
      userId: data.userId,
      resource: data.resource,
      action: data.action,
      ip: data.ip,
      timestamp: new Date().toISOString(),
    }, `Data access: ${data.action} ${data.resource}`);
  },

  // Log medication events
  medicationEvent: (data: { userId: string; action: string; medicationId?: string; ip?: string }) => {
    logger.info({
      event: 'MEDICATION_EVENT',
      userId: data.userId,
      action: data.action,
      medicationId: data.medicationId,
      ip: data.ip,
      timestamp: new Date().toISOString(),
    }, `Medication event: ${data.action}`);
  },

  // Log profile changes
  profileUpdate: (data: { userId: string; fields: string[]; ip?: string }) => {
    logger.info({
      event: 'PROFILE_UPDATE',
      userId: data.userId,
      updatedFields: data.fields,
      ip: data.ip,
      timestamp: new Date().toISOString(),
    }, 'Profile updated');
  },

  // Log security events
  securityEvent: (data: { event: string; userId?: string; ip?: string; details?: any }) => {
    logger.warn({
      event: 'SECURITY_EVENT',
      securityEvent: data.event,
      userId: data.userId,
      ip: data.ip,
      details: data.details,
      timestamp: new Date().toISOString(),
    }, `Security event: ${data.event}`);
  },
};

export default logger;
