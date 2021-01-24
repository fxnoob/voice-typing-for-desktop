import db from '../services/dbService';

describe('Db', () => {
  it('should get', async () => {
    const {initiated} = await db.get('initiated');
    console.log({initiated});
  });
});
