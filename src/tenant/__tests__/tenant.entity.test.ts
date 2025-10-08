import {createTenant} from '../../factories';
import Tenant from '../tenant.entity';

describe('Tenant', () => {
  it('name should be required', async () => {
    expect.assertions(2);
    try {
      await createTenant({name: null});
    } catch (error) {
      expect(error.message).toMatch('NOT NULL');
      expect(error.message).toMatch('tenant.name');
    }
  });

  it('email should be required', async () => {
    expect.assertions(2);
    try {
      await createTenant({email: null});
    } catch (error) {
      expect(error.message).toMatch('NOT NULL');
      expect(error.message).toMatch('tenant.email');
    }
  });

  it('email should be unique', async () => {
    expect.assertions(3);
    await createTenant({email: 'Tenant1@onfelix.com'});
    try {
      await createTenant({email: 'Tenant1@onfelix.com'});
    } catch (error) {
      expect(error.message).toMatch('UNIQUE');
      expect(error.message).toMatch('tenant.email');
    }
    await createTenant({email: 'Tenant2@onfelix.com'});
    const res = await Tenant.find();
    expect(res.length).toBe(2);
  });

  it('should return id and timestamps on create', async () => {
    const tenant = await createTenant();
    expect(tenant).toHaveProperty('id');
    expect(tenant).toHaveProperty('createdAt');
    expect(tenant).toHaveProperty('updatedAt');
  });
});
