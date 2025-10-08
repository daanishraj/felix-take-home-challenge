import {createApartment} from '../../factories';
import {CreateApartmentInput} from '../apartment.dto';
import Apartment from '../apartment.entity';
import COUNTRY_ERRORS from '../apartment.errors';
import ApartmentResolver from '../apartment.resolver';

const Resolver = new ApartmentResolver();

describe('ApartmentResolver', () => {
  it('apartments should return all apartments', async () => {
    const apartment = await createApartment();

    await expect(Resolver.apartments()).resolves.toMatchObject([apartment]);
  });

  it('apartment should return one apartment', async () => {
    const apartment = await createApartment();

    await expect(Resolver.apartment(apartment.id)).resolves.toMatchObject(apartment);
  });

  it('createApartment should return the created apartment', async () => {
    const apartment: CreateApartmentInput = {name: 'ApartmentName', address: 'ApartmentAddress'};

    const data = await Resolver.createApartment(apartment);
    expect(data.id).toBeDefined();
    expect(data.name).toBe(apartment.name);
    expect(data.address).toBe(apartment.address);

    await expect(Apartment.findOne({where: {id: data.id}})).resolves.toMatchObject(data);
  });

  it('updateApartment should return the update apartment', async () => {
    const apartment = await createApartment({name: 'WrongApartmentName'});

    const data = await Resolver.updateApartment({...apartment, name: 'CorrectApartmentName'});
    expect(data.id).toBe(apartment.id);
    expect(data.name).toBe('CorrectApartmentName');

    await expect(Apartment.findOne({where: {id: apartment.id}})).resolves.toMatchObject(data);
  });

  it('updateApartment should only update existing apartment', async () => {
    await expect(Resolver.updateApartment({id: 999} as Apartment)).rejects.toThrow(COUNTRY_ERRORS.INVALID_ID);
  });

  it('delete should delete and return the apartment', async () => {
    const apartment = await createApartment();

    await expect(Resolver.deleteApartment(apartment.id)).resolves.toMatchObject(apartment);

    await expect(Apartment.findOne({where: {id: apartment.id}})).resolves.toBeNull();
  });

  it('deleteApartment should only delete existing apartment', async () => {
    await expect(Resolver.deleteApartment(999)).rejects.toThrow(COUNTRY_ERRORS.INVALID_ID);
  });
});
