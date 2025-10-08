import {createTenant} from '../../factories';
import {CreateTenantInput} from '../tenant.dto';
import Tenant from '../tenant.entity';
import TENANT_ERRORS from '../tenant.errors';
import TenantResolver from '../tenant.resolver';

const Resolver = new TenantResolver();

describe('TenantResolver', () => {
  it('tenants should return all tenants', async () => {
    const tenant = await createTenant();

    await expect(Resolver.tenants()).resolves.toMatchObject([tenant]);
  });

  it('tenant should return one tenant', async () => {
    const tenant = await createTenant();

    await expect(Resolver.tenant(tenant.id)).resolves.toMatchObject(tenant);
  });

  it('createTenant should return the created tenant', async () => {
    const tenant: CreateTenantInput = {name: 'TenantName', email: 'Tenant@onfelix.com'};

    const data = await Resolver.createTenant(tenant);
    expect(data.id).toBeDefined();
    expect(data.name).toBe(tenant.name);

    await expect(Tenant.findOne({where: {id: data.id}})).resolves.toMatchObject(data);
  });

  it('updateTenant should return the update tenant', async () => {
    const tenant = await createTenant({name: 'WrongTenantName'});

    const data = await Resolver.updateTenant({...tenant, name: 'CorrectTenantName'});
    expect(data.id).toBe(tenant.id);
    expect(data.name).toBe('CorrectTenantName');

    await expect(Tenant.findOne({where: {id: tenant.id}})).resolves.toMatchObject(data);
  });

  it('updateTenant should only update existing tenant', async () => {
    await expect(Resolver.updateTenant({id: 999} as Tenant)).rejects.toThrow(TENANT_ERRORS.INVALID_ID);
  });

  it('delete should delete and return the tenant', async () => {
    const tenant = await createTenant();

    await expect(Resolver.deleteTenant(tenant.id)).resolves.toMatchObject(tenant);

    await expect(Tenant.findOne({where: {id: tenant.id}})).resolves.toBeNull();
  });

  it('deleteTenant should only delete existing tenant', async () => {
    await expect(Resolver.deleteTenant(999)).rejects.toThrow(TENANT_ERRORS.INVALID_ID);
  });
});
