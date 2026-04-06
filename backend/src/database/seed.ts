import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const usersService = app.get(UsersService);

  const email = process.env.SUPERADMIN_EMAIL;
  const rawPassword = process.env.SUPERADMIN_PASSWORD;

  if (!email || !rawPassword) {
    console.error(
      'SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be set in .env before seeding.',
    );
    await app.close();
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  await usersService.upsertSuperadmin({ email, password: hashedPassword });

  console.log(`✓ SUPERADMIN seeded: ${email}`);
  await app.close();
}

void seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
