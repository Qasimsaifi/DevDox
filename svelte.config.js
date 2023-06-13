import adapter from '@sveltejs/adapter-vercel';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('.env') });

const config = {
  kit: {
    adapter: adapter({
      // see the 'Deployment configuration' section below
    })
  }
};

export default config;
