import * as dotenv from 'dotenv';
import * as Joi from 'joi';

export enum Environment {
  local = 'local',
  development = 'development',
  staging = 'staging',
  production = 'production',
  test = 'test',
}

dotenv.config({ path: `.env.${process.env.NODE_ENV || Environment.local}` });

interface IEnvironmentConfig {
  NODE_ENV: Environment;
  PORT: number;
  DATABASE_URL: string;

  SW_API_BASE_URL: string;

  RICK_AND_MORTY_API_BASE_URL: string;

  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;
  CACHE_DEFAULT_TTL: number;
}

const validationSchemaConfig = Joi.object<IEnvironmentConfig>({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .required()
    .default(Environment.local),
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),

  SW_API_BASE_URL: Joi.string().uri().required(),

  RICK_AND_MORTY_API_BASE_URL: Joi.string().uri().required(),

  REDIS_HOST: Joi.string().hostname().required(),
  REDIS_PORT: Joi.number().port().required(),
  REDIS_PASSWORD: Joi.string().optional().allow(''),
  CACHE_DEFAULT_TTL: Joi.number().min(1).required().default(300),
}).unknown(true);

const { error, value } = validationSchemaConfig.validate(process.env, {
  abortEarly: false,
});

if (error) {
  const errorMessage = error.details.map((detail) => detail.message).join(', ');
  console.error(`Config validation error: ${errorMessage}`);
  throw new Error(`Config validation error: ${errorMessage}`);
}

export const EnvironmentConfig: IEnvironmentConfig = value;
