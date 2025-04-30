/**
 * Represents an address.
 */
export interface Address {
  /**
   * The street address.
   */
  street: string;
  /**
   * The city.
   */
  city: string;
  /**
   * The state.
   */
  state: string;
  /**
   * The country.
   */
  country: string;
  /**
   * The postal code.
   */
  postalCode: string;
}

/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Coordinates {
  /**
   * The latitude of the location.
   */
  latitude: number;
  /**
   * The longitude of the location.
   */
  longitude: number;
}

/**
 * Asynchronously retrieves the coordinates for a given address.
 *
 * @param address The address to geocode.
 * @returns A promise that resolves to a Coordinates object containing the latitude and longitude of the address.
 */
export async function getCoordinates(address: Address): Promise<Coordinates> {
  // TODO: Implement this by calling an API.
  console.log(`Getting coordinates for ${address.street}, ${address.city}`);
  return {
    latitude: -23.5505,
    longitude: -46.6333,
  };
}
