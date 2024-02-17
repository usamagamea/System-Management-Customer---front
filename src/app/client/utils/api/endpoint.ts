const URL = 'https://localhost:44341/api';
export const API = {
  COUNTRY: `${URL}/countries`,
  CITY: `${URL}/cities`,
  CUSTOMER: `${URL}/customers`,
  CITY_BY_COUNTRY_ID: (id: number) =>
    `${URL}/cities/cities/GetAllCitiesByCountryId/${id}`,
};
