const URL = 'https://localhost:44341/api';
export const API = {
  COUNTRY: `${URL}/countries`,
  CITY: `${URL}/cities`,
  CUSTOMER: `${URL}/customers`,
  DELETE_CUSTOMER: (id: number) => `${URL}/customers/${id}`,

  CUSTOMER_BY_ID: (id: number) => `${URL}/customers/customers/${id}`,
  CITY_BY_COUNTRY_ID: (id: number) =>
    `${URL}/cities/cities/GetAllCitiesByCountryId/${id}`,
};
