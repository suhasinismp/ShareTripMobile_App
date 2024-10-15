import { getAPI, patchAPI, postFormDataAPI } from '../utils/servicesUtil';
export const getGroups = async (token) => {
  const response = await getAPI('share-trip/groups', token);
  return response;
};

export const createGroup = async (data, token) => {
  const response = await postFormDataAPI('share-trip/groups', data, token);
  return response;
};

export const getGroupRequestByUserId = async (userId, token) => {
  const response = await getAPI(`share-trip/group-users-invite/request-data/${userId}`, token);
  return response;
}
export const groupAcceptInvite = async (token, group_Id, user_Id) => {
  const response = await patchAPI({ endUrl: `share-trip/group-users-invite/accept-invitation?user_id=${user_Id}&group_id=${group_Id}`, token: token })

  return response;
}

export const groupDeclineInvite = async (token, group_Id, user_Id) => {
  const response = await patchAPI({ endUrl: `share-trip/group-users-invite/decline-invitation?user_id=${user_Id}&group_id=${group_Id}`, token: token });
  return response;
}