import config from '../constants/config';
import { getAPI, postAPI } from '../utils/servicesUtil';

export const getSubscriptionPlans = async () => {
  const response = await getAPI(
  
    `share-trip/subscription-plan/admin`,
    config.ADMIN_TOKEN,
  );
  return response;
};

// export const postSubscriptionPlans =async()=>{
//   const response = await postAPI(
//     'share-trip/user-subscription/', config.ADMIN_TOKEN,
//   );
//   return response;
// }