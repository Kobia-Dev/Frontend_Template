import { privileges } from "./privilages";

export const userJSON = {
  "type": "Bearer",
  "id": 1,
  "username": "soaadmin",
  "email": "wahomejipheens@gmail.com",
  "roles": [
    "ROLE_ADMIN"
  ],
  "privileges": privileges,
  "systemGenPassword": false
};
