function env(key: string): string;
function env(key: string, defaultValue: string): string;
function env(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (value != null) {
    return value;
  }

  if (defaultValue != null) {
    return defaultValue;
  }

  throw new Error(`Environment variable "${key}" is not defined`);
}

export default env;