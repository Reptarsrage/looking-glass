import net, { ListenOptions } from 'node:net';
import os from 'node:os';

import { has } from './utils';

function hasErrorCode(codes: string[], error: unknown) {
  return error && has('code', error) && typeof error.code === 'string' && codes.includes(error.code);
}

class Locked extends Error {
  constructor(port: number) {
    super(`${port} is locked`);
  }
}

const lockedPorts = {
  old: new Set(),
  young: new Set(),
};

// On this interval, the old locked ports are discarded,
// the young locked ports are moved to old locked ports,
// and a new young set for locked ports are created.
const releaseOldLockedPortsIntervalMs = 1000 * 15;

// Lazily create interval on first use
let interval: ReturnType<typeof setInterval> | undefined;

const getLocalHosts = () => {
  const interfaces = os.networkInterfaces();

  // Add undefined value for createServer function to use default host,
  // and default IPv4 host in case createServer defaults to IPv6.
  const results = new Set([undefined, '0.0.0.0']);

  for (const info of Object.values(interfaces)) {
    for (const config of info ?? []) {
      results.add(config.address);
    }
  }

  return results;
};

const checkAvailablePort = (options: ListenOptions): Promise<number> =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);

    server.listen(options, () => {
      const info = server.address();
      server.close(() => {
        if (info && typeof info !== 'string' && has('port', info) && typeof info.port === 'number') {
          resolve(info.port);
        } else {
          reject(new Error('Port is not a number'));
        }
      });
    });
  });

const getAvailablePort = async (
  options: ListenOptions,
  hosts: Set<string | undefined>
): Promise<number | undefined> => {
  if (options.host || options.port === 0) {
    return checkAvailablePort(options);
  }

  for (const host of hosts) {
    try {
      await checkAvailablePort({ port: options.port, host }); // eslint-disable-line no-await-in-loop
    } catch (error: unknown) {
      if (!hasErrorCode(['EADDRNOTAVAIL', 'EINVAL'], error)) {
        throw error;
      }
    }
  }

  return options.port;
};

function* portCheckSequence(ports: number[] | undefined) {
  if (ports) {
    yield* ports;
  }

  yield 0; // Fall back to 0 if anything else failed
}

type GetPortsOptions = {
  port?: number | number[];
  exclude?: number[];
};

async function getPorts(options?: GetPortsOptions): Promise<number | undefined> {
  let ports;
  let exclude = new Set();

  if (options) {
    if (options.port) {
      ports = typeof options.port === 'number' ? [options.port] : options.port;
    }

    if (options.exclude) {
      const excludeIterable = options.exclude;

      if (typeof excludeIterable[Symbol.iterator] !== 'function') {
        throw new TypeError('The `exclude` option must be an iterable.');
      }

      for (const element of excludeIterable) {
        if (typeof element !== 'number') {
          throw new TypeError(
            'Each item in the `exclude` option must be a number corresponding to the port you want excluded.'
          );
        }

        if (!Number.isSafeInteger(element)) {
          throw new TypeError(`Number ${element} in the exclude option is not a safe integer and can't be used`);
        }
      }

      exclude = new Set(excludeIterable);
    }
  }

  if (interval === undefined) {
    interval = setInterval(() => {
      lockedPorts.old = lockedPorts.young;
      lockedPorts.young = new Set();
    }, releaseOldLockedPortsIntervalMs);

    // Does not exist in some environments (Electron, Jest jsdom env, browser, etc).
    if (interval.unref) {
      interval.unref();
    }
  }

  const hosts = getLocalHosts();

  for (const port of portCheckSequence(ports)) {
    try {
      if (exclude.has(port)) {
        continue;
      }

      let availablePort = await getAvailablePort({ ...options, port }, hosts); // eslint-disable-line no-await-in-loop
      while (lockedPorts.old.has(availablePort) || lockedPorts.young.has(availablePort)) {
        if (port !== 0) {
          throw new Locked(port);
        }

        availablePort = await getAvailablePort({ ...options, port }, hosts); // eslint-disable-line no-await-in-loop
      }

      lockedPorts.young.add(availablePort);

      return availablePort;
    } catch (error) {
      if (!hasErrorCode(['EADDRINUSE', 'EACCES'], error) && !(error instanceof Locked)) {
        throw error;
      }
    }
  }

  throw new Error('No available ports found');
}

export default getPorts;
