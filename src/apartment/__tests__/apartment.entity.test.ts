import {createApartment} from '../../factories';
import Apartment from '../apartment.entity';

describe('Apartment', () => {
  it('name should be required', async () => {
    expect.assertions(2);
    try {
      await createApartment({name: null});
    } catch (error) {
      expect(error.message).toMatch('NOT NULL');
      expect(error.message).toMatch('apartment.name');
    }
  });

  it('name should be unique', async () => {
    expect.assertions(3);
    await createApartment({name: 'Apartment1'});
    try {
      await createApartment({name: 'Apartment1'});
    } catch (error) {
      expect(error.message).toMatch('UNIQUE');
      expect(error.message).toMatch('apartment.name');
    }
    await createApartment({name: 'Apartment2'});
    const res = await Apartment.find();
    expect(res.length).toBe(2);
  });

  it('should return id and timestamps on create', async () => {
    const apartment = await createApartment();
    expect(apartment).toHaveProperty('id');
    expect(apartment).toHaveProperty('createdAt');
    expect(apartment).toHaveProperty('updatedAt');
  });
});
