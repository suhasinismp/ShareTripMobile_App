import config from '../constants/config';
import { getAPI } from '../utils/servicesUtil';

export const getSubscriptionPlans = async () => {
  const response = await getAPI(
    `share-trip/subscription-plan/admin`,
    config.ADMIN_TOKEN,
  );
  return response;
};
