// this is a hack to get around the fact that prisma is not yet compatible with esm.
// bun is using esm, so we need to use esm too.
// ref: https://github.com/prisma/prisma/issues/5030#issuecomment-1398076317
import type { PrismaClient as ImportedPrismaClient } from '@prisma/client';
import { createRequire } from 'module';

const require = createRequire(import.meta.url ?? __filename);

const { PrismaClient: RequiredPrismaClient } = require('@prisma/client');

const _PrismaClient: typeof ImportedPrismaClient = RequiredPrismaClient;

export class PrismaClient extends _PrismaClient {}