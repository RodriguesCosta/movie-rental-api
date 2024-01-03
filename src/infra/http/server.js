import 'dotenv/config';

import { app } from './app.js';

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333');
});
